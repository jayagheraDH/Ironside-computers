import type { InferGetStaticPropsType } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { ToastContainer, toast, Flip } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { Portal } from '@reach/portal'
import { builder } from '@builder.io/react'
import { Layout } from '@components/common'
import AccordianBlock from '@components/AccordianBlock/AccordianBlock'
import IronsideLogo from '@components/icons/IronsideLogo'
import AdminUserModal from '@components/ui/AdminUserModal/AdminUserModal'
import { DeleteUserModal } from '@components/ui/AdminUserModal'

export async function getStaticProps() {
  const header = await builder.get('header').toPromise()
  let products = []
  try {
    const result = await axios.get(
      `https://fair-conduit-404516.uc.r.appspot.com/big-commerce/stores/gbo8rdqwz4/products`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    products = result.data.data
  } catch (error) {
    console.error(error)
  }
  return {
    props: { header, products },
    revalidate: 14400,
  }
}

export default function SecretUrl({
  products,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [accordions, setAccordions] = useState<any>([])
  const [tabName, setTabName] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)
  const [tabNameError, setTabNameError] = useState(false)
  const [filterData, setFilterData] = useState([])
  const [allTabsData, setAllTabsData] = useState([])
  const [isLoading, setisLoading] = useState(false)
  const [isRuleAdded, setIsRuleAdded] = useState(false)
  const [addUserPopUp, setAddUserPopUp] = useState(false)
  const [deleteUserPopUp, setDeleteUserPopUp] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const [token, setToken] = useState('')

  if (typeof window !== 'undefined') {
    document.querySelector('#body')?.setAttribute('data-theme', 'dark')
    document.querySelector('html')?.removeAttribute('data-theme')
  }
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  const getData = async () => {
    products.forEach((element: any) => {
      element['value'] = `${element.name} ${
        element.sku ? `(${element.sku})` : ''
      }`
      element['label'] = `${element.name} ${
        element.sku ? `(${element.sku})` : ''
      }`
    })
    try {
      const composition = await axios.get(
        `https://fair-conduit-404516.uc.r.appspot.com/iron-side/compositions`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const compositions = composition.data.data || []
      const filterCompositions = composition?.data?.data?.map((data: any) => {
        const obj = {
          _id: data?._id,
          name: data?.name,
          components: [data?.products, data?.incompatible_products],
        }
        return obj
      })
      setAllTabsData(filterCompositions)
      setAccordions(compositions)
    } catch (error) {
      router.push(`/admin-auth-login`)
      notify()
    }
    setFilterData(products)
    setisLoading(false)
  }

  const notify = () => {
    toast.error('Session expired!')
  }
  const addTab = () => {
    setTabNameError(false)
    setIsRuleAdded(true)
    if (!tabName.replace(/\s/g, '').length) {
      setTabNameError(true)
      return
    } else {
      setAccordions([
        ...accordions,
        {
          name: `${tabName}`,
          incompatible_products: [],
          products: [],
        },
      ])
      setShowModal(false)
      setTabName('')
    }
  }

  const submitAll = async (title: any, updateSelection: any) => {
    const incompatibleData: any = {
      name: title,
      components: [updateSelection[0], updateSelection[1]],
    }

    const tabsData: any = [...allTabsData]
    if (tabsData?.length) {
      let isExist = -1
      let _id = 0
      tabsData?.forEach((tab: any, index: any) => {
        if (tab?.name === title) {
          _id = tab?._id
          isExist = index
        }
      })
      if (isExist !== -1) {
        if (_id) incompatibleData._id = _id
        tabsData[isExist] = incompatibleData
      } else tabsData.push(incompatibleData)
    } else tabsData.push(incompatibleData)
    setAllTabsData(tabsData)
  }

  const submitAllButton = () => {
    try {
      setisLoading(true)
      allTabsData?.forEach(async (tab: any) => {
        if (tab?._id) {
          await axios
            .put(
              `https://fair-conduit-404516.uc.r.appspot.com/iron-side/compositions/${tab?._id}`,
              tab,
              {
                headers,
              }
            )
            .then(
              (response) => {
                if (response.status === 200) {
                }
              },
              (error) => {
                console.error(error)
                setisLoading(false)
                return
              }
            )
        } else {
          await axios
            .post(
              'https://fair-conduit-404516.uc.r.appspot.com/iron-side/compositions',
              tab,
              {
                headers,
              }
            )
            .then(
              (response) => {
                if (response.status === 200) {
                }
              },
              (error) => {
                console.error(error)
                setisLoading(false)
                return
              }
            )
        }
      })
      toast.success('Submitted Successfully!')
      setisLoading(false)
    } catch (error) {
      setisLoading(false)
      console.error(error)
    }
  }

  useEffect(() => {
    setisLoading(true)
    if (token) getData()
    else return
  }, [token])

  useEffect(() => {
    const userToken = localStorage.getItem('jwtToken')
    if (!userToken) router.push(`/admin-auth-login`)
    else {
      setToken(userToken)
    }
  }, [])

  return (
    <div className="admin-panel">
      <header className="admin-header flex align-v-center justify-center">
        <h1 className="mb-0">
          <Link href="/">
            <a href="/">
              <IronsideLogo />
            </a>
          </Link>
        </h1>
      </header>
      <div className="admin flex flex-direction justify-center">
        <button
          className="btn-small"
          onClick={() => {
            localStorage.removeItem('jwtToken')
            router.push('/')
          }}
        >
          Logout
        </button>
        {isLoading ? (
          <div className="content-flex w-100">
            <span className="loader"></span>
          </div>
        ) : (
          <>
            <h2>Incompatibilities Rules</h2>
            <div className="mb-5">
              <button
                className="btn"
                onClick={() => {
                  setAddUserPopUp(true)
                  setDeleteUserPopUp(false)
                }}
              >
                Add User
              </button>
              <button
                className="btn"
                onClick={() => {
                  setDeleteUserPopUp(true)
                  setAddUserPopUp(false)
                }}
              >
                Delete User
              </button>
            </div>
            <div className="expand-buttons">
              <div className="flex" onClick={() => setIsOpen(!isOpen)}>
                <button className="btn">Expand All</button>
                <button className="btn" onClick={() => submitAllButton()}>
                  Submit All
                </button>
              </div>
            </div>
            {!!accordions?.length &&
              accordions?.map((data: any, index: any) => (
                <AccordianBlock
                  key={index}
                  title={data.name}
                  ruleId={data._id}
                  products={data.products}
                  incompatible_products={data.incompatible_products}
                  options={filterData}
                  accordionList={accordions}
                  accordianIndex={index}
                  setAccordionList={setAccordions}
                  getData={getData}
                  token={token}
                  isRuleAdded={isRuleAdded}
                  setIsRuleAdded={setIsRuleAdded}
                  totalRules={accordions?.length}
                  isOpenAll={isOpen}
                  submitAll={submitAll}
                />
              ))}
            <button
              className="btn"
              type="button"
              onClick={() => setShowModal(true)}
            >
              Add Rule
            </button>
          </>
        )}
        {!!showModal && (
          <div className="popup-bg">
            <div className="popup">
              <h3>Rule Name</h3>
              <input
                type="text"
                placeholder="Enter name"
                onChange={(e) => {
                  setTabName(e.target.value)
                }}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    addTab()
                  }
                }}
              />
              {tabNameError && (
                <div className="error-message text-red border-red">
                  <p className="text-red">Name is required.</p>
                </div>
              )}
              <div className="mt-5 d-flex justify-space">
                <button
                  className="btn"
                  onClick={() => {
                    setShowModal(false)
                    setTabNameError(false)
                  }}
                >
                  Cancel
                </button>
                <button onClick={() => addTab()} className="btn">
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {addUserPopUp && <AdminUserModal setAddUserPopUp={setAddUserPopUp} />}
      {deleteUserPopUp && (
        <DeleteUserModal setDeleteUserPopUp={setDeleteUserPopUp} />
      )}
      <Portal>
        <ToastContainer
          transition={Flip}
          position="bottom-center"
          autoClose={5000}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
          theme="dark"
        />
      </Portal>
    </div>
  )
}

SecretUrl.Layout = Layout
