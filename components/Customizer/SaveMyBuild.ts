const SaveMyBuild = (optionSelections: any, selectedColor: any, setBuildUrl: any) => {
    optionSelections?.forEach((ele: any, index: number) => {
        selectedColor?.forEach((data: any) => {
            if (data?.option_id === ele?.option_id) {
                optionSelections[index] = data
            }
        })
    })
    const newObject: any = {};    
    optionSelections.forEach((item: any) => {
        newObject[item.option_id] = item.option_value;
    });
    const searchParams = new URLSearchParams(newObject);
    setBuildUrl(`${window.location.origin}${window.location.pathname}?${searchParams.toString()}`)
}

export default SaveMyBuild