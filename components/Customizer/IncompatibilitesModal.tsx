import React from 'react'
import { Button } from '@components/ui'
import { Cross } from '@components/icons'
import WrongPassword from '@components/icons/WrongPassword'

const IncompatibilitesModal = ({
  incompatibleProducts,
  selectedIds,
  categoriesDataFiltered,
  onModalSelection,
  setIncompatibleModal
}: any) => {
  const openSelectionModal = (category_name: string) => {
    let filterCategory = {}
    categoriesDataFiltered?.forEach((ele: any) => {
      ele?.subCategory.find((cat: any) => {
        if (cat?.categoryName === category_name) filterCategory = cat
      })
    })
    setIncompatibleModal(false)
    onModalSelection(filterCategory)
  }
  return (
    <div className="modal incompatibilites-modal">
      <div className="incompatibilites-modal-header">
        <WrongPassword />
        <h2 className='mb-0'>Incompatibilites</h2>
      </div>
      <button
        onClick={() => setIncompatibleModal(false)}
        aria-label="Close panel"
        className="modal-close"
      >
        <Cross className="h-6 w-6" />
      </button>
      {Object.keys(incompatibleProducts)?.map((ele) =>
        selectedIds?.map((prods: any) => {
          if (parseInt(ele) === prods?.product_id) {
            return incompatibleProducts[ele][1]?.map((incompat: any) =>
              selectedIds?.map((data: any) => {
                if (data?.product_id === incompat?.product_id) {
                  return (
                    <div className='incompatibilites-list'>
                      <p key={`${prods?.product_id}-${data?.product_id}`}>
                        {prods?.product_name} is not compatible with&nbsp;
                        {data?.product_name}
                      </p>
                      <div className="buttons">
                        <Button
                          type="button"
                          className="btn add-to-cart"
                          onClick={() => {
                            openSelectionModal(prods?.category_name)
                          }}
                        >
                          Change {prods?.category_name}
                        </Button>
                        <Button
                          type="button"
                          className="btn add-to-cart"
                          onClick={() => {
                            openSelectionModal(data?.category_name)
                          }}
                        >
                          Change {data?.category_name}
                        </Button>
                      </div>
                    </div>
                  )
                }
                return null
              })
            )
          }
          return null
        })
      )}
    </div>
  )
}

export default IncompatibilitesModal
