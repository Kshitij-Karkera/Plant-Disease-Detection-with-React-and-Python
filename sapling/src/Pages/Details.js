import React, { useEffect, useState } from 'react'
import './Details.css'
import { storage } from '../FirebaseHandler'
import { ref, uploadBytes } from 'firebase/storage'
import plantDataJson from '../Plant_Result.json'
import { useStateValue } from '../StateProvider'
import { useNavigate } from 'react-router-dom'

function Details() {
    const [{image, myData}] = useStateValue()

    const [showDisease, setshowDisease] = useState(false)
    const [showTreatment, setshowTreatment] = useState(false)
    const [showSuggestions, setshowSuggestions] = useState(false)
    const [showFeedBack, setshowFeedBack] = useState(false)

    const [predict, setpredict] = useState('Yes')
    const [showcorrectName, setshowcorrectName] = useState('')
    const [getImage, setgetImage] = useState('No')

    const [popUp, setpopUp] = useState(false)
    const navigate = useNavigate()
    let correctName = null
    
    const plantData = plantDataJson[myData[1]?.data.class]

    useEffect(() => {
        window.scrollTo(0, 0)
        if(plantData.Plant_Disease === 'Healthy') {
            setshowDisease(false)
            setshowSuggestions(true)
        } else {
            setshowDisease(true)
            setshowSuggestions(false)
        }
        // eslint-disable-next-line
    }, [])

    const setPredictValue = (e) => {
        setpredict(e.target.value)
        if(predict === 'Yes') {
            setshowcorrectName('')
        }
    }

    const setGetImageFromUser = (e) => {
        setgetImage(e.target.value)
    }

    const setCorrectName = (e) => {
        setshowcorrectName(e.target.value)
    }

    const onClickDisease = () => {
        setshowDisease(true)
        setshowTreatment(false)
        setshowSuggestions(false)
        setshowFeedBack(false)
        setpredict('Yes')
    }

    const onClickTreatment = () => {
        setshowDisease(false)
        setshowTreatment(true)
        setshowSuggestions(false)
        setshowFeedBack(false)
        setpredict('Yes')
    }

    const onClickSuggestions = () => {
        setshowDisease(false)
        setshowTreatment(false)
        setshowSuggestions(true)
        setshowFeedBack(false)
        setpredict('Yes')
    }

    const onClickFeedback = () => {
        setshowDisease(false)
        setshowTreatment(false)
        setshowSuggestions(false)
        setshowFeedBack(true)
        setpredict('Yes')
    }

    const submitButton = (e) => {
        correctName = showcorrectName.slice(0, 1).toUpperCase() + showcorrectName.slice(1,) + '_' + Math.floor(Math.random() * 10000000)

        if(predict === 'No') {
            if(showcorrectName.length > 0) {
                e.preventDefault()
                if(getImage === 'Yes') {                    
                    if (image[1] === null) return 
                    const fileRef = ref(storage, `image/${correctName}`)
                    uploadBytes(fileRef, image[1]).then(() => {
                        setpopUp(true)
                    }).catch((error) => {
                        console.log(error)
                    })
                }
                else{
                    setpopUp(true)
                }
            }

        } else {
            e.preventDefault()
            if(getImage === 'Yes') {                
                if (image[1] === null) return 
                const fileRef = ref(storage, `image/${plantData.Plant_Name + correctName}`)
                uploadBytes(fileRef, image[1]).then(() => {
                    setpopUp(true)
                }).catch((error) => {
                    console.log(error)
                })
            }
            else{
                setpopUp(true)
            }
        }
      
    }

    const closeModal = () => {
        setpopUp(false) 
        navigate('/')
    }
  return (
    <>
        <div className="img-info">
            <div className="container2">
                <div className="images">
                    <img src={URL.createObjectURL(image[1])} alt="Leaf" />
                </div>
            </div>	

            <div className="container3">
                <div id="p-d-name">
                    <div id="p-name">
                        <span>Plant Name</span>
                        <span>{plantData.Plant_Name}</span>
                    </div>
                    <div id="d-name">
                        <span>Disease Name</span>
                        <span>{plantData.Plant_Disease}</span>
                    </div>
                </div>
                <div className="accuracy">
                    <span>Confidence: </span>
                        <span>
                            {
                                myData[1]?.data.Confidence.toString().length > 5 ? 
                                    myData[1]?.data.Confidence.toString().slice(0,5) :
                                    myData[1]?.data.Confidence.toString()
                            }%
                        </span>
                </div>
            </div>
        </div>	
        <div className="main-info-container">
            <div className='main-info-content'>
                <div className='tabsContainer'>
                    {
                        plantData.Plant_Disease === 'Healthy' ? 
                            <button className='tab' onClick={onClickSuggestions}>Suggestions</button>
                            :
                            <>
                                <button className='tab' onClick={onClickDisease}>Disease Description</button>
                                <button className='tab' onClick={onClickTreatment}>Treatment</button>
                            </> 
                    }
                    <button className='tab' onClick={onClickFeedback}>Feedback</button>
                </div>

                
                    {
                        showDisease ? 
                            <div className='plantData'>
                                <div className='diseaseDesc'>
                                    <div className='title'>Disease Description :</div>
                                        {plantData.Disease_Description}
                                    </div>
                            </div> :
                            null
                    }

                    {
                        showTreatment ? 
                            <div className='plantData'>
                                <div className='diseaseDesc'>
                                    <div className='title'>Treatment :</div>
                                        {
                                            plantData.Treatment.map((item) => {
                                                return (
                                                    <div key={item}>
                                                        {item}
                                                    </div>
                                                )
                                            })
                                        }
                                </div>
                            </div> :
                            null
                    }

                    {
                        showSuggestions ? 
                            <div className='plantData'>
                                <div className='diseaseDesc'>
                                    <div className='title'>Suggestions :</div>
                                    {
                                            plantData.Suggestions.map((item) => {
                                                return (
                                                    <div key={item}>
                                                        {item}
                                                    </div>
                                                )
                                            })
                                    }
                                </div>
                            </div> :
                            null
                    }

                    {
                        showFeedBack ?
                            <form method='POST' className='feedBackForm'>
                            <div className='questions'>
                                <div>Did the AI correctly predict the plant name?</div>
                                <div className='options'>
                                    <div className='predictYESNO'>
                                        <input type='radio' id='Yes1' value='Yes' name='predict' onClick={setPredictValue}/>
                                        <label htmlFor='Yes1'>Yes</label>
                                        <input type='radio' id='No1' value='No' name='predict' onClick={setPredictValue}/>
                                        <label htmlFor='No1'>No</label>
                                    </div>
                                    {
                                        predict === 'No' ? 
                                        <div className='correctPlantName'>
                                            <label htmlFor='plantName'>Enter the correct plant name :</label>
                                            <input type='text' id='plantName' required autoComplete='off' value={showcorrectName} onChange={setCorrectName} />
                                        </div>
                                        :
                                        null
                                    }
                                    
                                </div>
                            </div>
                            <div className='questions'>
                                <div>Can we use this image to train our AI to increase the accuracy?</div>
                                <div className='options'>
                                    <input type='radio' id='Yes2' value='Yes' name='train' onClick={setGetImageFromUser} />
                                    <label htmlFor='Yes2'>Yes</label>
                                    <input type='radio' id='No2' value='No' name='train' onClick={setGetImageFromUser} />
                                    <label htmlFor='No2'>No</label>
                                </div>
                            </div>
                            <input type='submit' className='submitButton' onClick={submitButton} />
                        </form>
                        :
                        null
                    }
            </div>
            {
                popUp ? 
                <div className='popUpContainer'>
                    <div className='popUp'>
                        <button className='closePopUp' onClick={closeModal}>X</button>
                        <h3>THANK YOU FOR THE FEEDBACK</h3>
                        {
                            getImage === 'Yes' ? 
                            'Image has been Uploaded'
                            :null
                        }
                    </div>
                </div>
                :
                null

            }
            
        </div>
    </>
  )
}

export default Details