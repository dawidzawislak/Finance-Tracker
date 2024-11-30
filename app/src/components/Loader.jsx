import '../style/loader.css'

function Loader() {

    return (
        <>
        <div className='loader-div'>
            <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            <div style={{width: "100%", fontSize: "2rem", textAlign: "center", marginTop: "10px"}}>
                Loading your assets...
            </div>
        </div>
        </>
    )
}

export default Loader