const Customizer = (props: any) => {
  console.log("Customizer", props);

  return (
    <div>
      <h1 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
        {props.title}
      </h1>
      {props?.customizer && (
        <div style={{ textAlign: 'center', margin: '2px' }}>
          {props?.customizer?.value?.data &&
            Object.entries(
              props?.customizer?.value?.data?.incompatibleData
            ).map(([key, value]) => (
              <>
                <div>
                  {key} --- {value}
                </div>
              </>
            ))}
        </div>
      )}
    </div>
  )
}

export default Customizer
