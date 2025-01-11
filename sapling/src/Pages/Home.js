import React, { useState } from 'react'
import { useEffect } from 'react';
import './Home.css'
import { useStateValue } from '../StateProvider'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';


function Home() {

    const [imageUpload, setimageUpload] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    // eslint-disable-next-line
    const [{image, myData}, dispatch] = useStateValue()
    const navigate = useNavigate()
    useEffect(() => {
        const realFileBtn = document.getElementById("file")
        const custBtn = document.getElementById("custom-button")
        const custTxt = document.getElementById("custom-text")
    
        custBtn.addEventListener("click", () => {
          realFileBtn.click();
        })

        realFileBtn.addEventListener("change", () => {
          if(realFileBtn.value) {
            // eslint-disable-next-line
            custTxt.innerHTML = realFileBtn.value.match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1];
          } else {
            custTxt.innerHTML = "No file selected";
          }
        })
      }, [])

    const handleFileChange = (e) => {
        setimageUpload(e.target.files[0])
        dispatch({
            type: "UPLOAD_IMAGE",
            item: e.target.files[0]
          })

    }

    const handleFileUpload = async() => {
            setIsLoading(true)
            let formData = new FormData()
            formData.append("file", imageUpload)
            let res = await axios({
                method: "post",
                responseType: 'json',
                url: 'http://127.0.0.1:8000/predict',
                data: formData,
            })
            if(res.status === 200) {
                navigate("/Details")
                setIsLoading(false)
            }

            dispatch({
                type:"SET_DATA",
                item:res
            })
    }

  return (
    <>
        <div className="info">
            <p className="infobox-boldtext" >
            Discover the plant disease, just by a<br /><span id="textstyle">single leaf</span> 
            </p>
            <p className="infobox-slimtext" >
            Just by a single image of a leaf we can find if the plant is healthy or infected. We have trained <br />the AI with sample leafs which gives us 98.69% accuracy.<br /><br />
            Supported Plants - Apple, Blueberry, Cherry, Corn, Grape, Orange,Peach, <br />Pepper, Potato, Rasberry, Soybean, Squash, Strawberry, Tomato.
            </p>
        </div>
        <div className="blockdis">
            <div className="svgcontainer">
                <svg viewBox="0 0 100 100">
                    <filter id="blur">
                        <feMorphology in="SourceGraphic" operator="dilate" radius="0.3"></feMorphology>    
                    </filter>
                    <filter id="turbulence">
                        <feComponentTransfer>
                            <feFuncR type="discrete" tableValues="0 0.5 0 1"/>
                            <feFuncG type="discrete" tableValues="0 0.5 0 1"/>
                            <feFuncB type="discrete" tableValues="0 0.5 0 1"/>
                            <feFuncA type="discrete" tableValues="0 0.5 0 1"/>
                        </feComponentTransfer>
                    </filter>
                    <filter id="convolve">
                        <feComponentTransfer>
                            <feFuncR type="table" tableValues="0 0.5 0 1" />
                            <feFuncG type="table" tableValues="0 0.5 0 1" />
                            <feFuncB type="table" tableValues="0 0.5 0 1" />
                            <feFuncA type="table" tableValues="0 0.5 0 1" />
                        </feComponentTransfer>
                    </filter>
                    <mask id="mask1">
                        <line x1="0" y1="0%" x2="100" y2="200" stroke="white" strokeWidth="15">
                            <animate attributeName="x1" values="7.5%;92.5%;7.5%" dur="10s" begin="-2s" repeatCount="indefinite" />
                            <animate attributeName="x2" values="7.5%;92.5%;7.5%" dur="10s" begin="-2s" repeatCount="indefinite" />
                        </line>
                    </mask>
                    <mask id="mask2">
                        <line x1="0" y1="0" x2="200" y2="100" stroke="white" strokeWidth="15">
                            <animate attributeName="y1" values="7.5%;92.5%;7.5%" dur="10s" begin="-4s" repeatCount="indefinite" />
                            <animate attributeName="y2" values="7.5%;92.5%;7.5%" dur="10s" begin="-4s" repeatCount="indefinite" />
                        </line>
                    </mask>
                    <mask id="mask3">
                        <line x1="0" y1="0" x2="200" y2="100" stroke="white" strokeWidth="15">
                            <animate attributeName="y1" values="7.5%;92.5%;7.5%" dur="10s" begin="-6s" repeatCount="indefinite" />
                            <animate attributeName="y2" values="7.5%;92.5%;7.5%" dur="10s" begin="-6s" repeatCount="indefinite" />
                        </line>
                    </mask>
                    <mask id="mask4">
                        <line x1="0" y1="0" x2="100" y2="200" stroke="white" strokeWidth="15">
                            <animate attributeName="x1" values="7.5%;92.5%;7.5%" dur="10s" begin="-8s" repeatCount="indefinite" />
                            <animate attributeName="x2" values="7.5%;92.5%;7.5%" dur="10s" begin="-8s" repeatCount="indefinite" />
                        </line>
                    </mask>	
                    <image width="100" href="Images/leaf.jpg" />

                    <image width="100" filter="url(#turbulence)"  mask="url(#mask2)" href="Images/leaf.jpg"/>
                    <image width="100" filter="url(#blur)"  mask="url(#mask1)" href="Images/leaf.jpg"/>
                    <image width="100" filter="invert(100%)"  mask="url(#mask4)" href="Images/leaf.jpg"/>
                    <image width="100" filter="url(#convolve)"  mask="url(#mask3)" href="Images/leaf.jpg"/>
                </svg>
                <div className="custom-file-upload">
                    <input type="file" id="file" hidden="hidden" onChange={handleFileChange} required />
                    <button type="button" id = "custom-button"><label>Upload image</label></button>
                    <span id="custom-text">No file selected</span>
                </div>
            </div>
            <button className="predictbtn" onClick={handleFileUpload}>
                {
                    isLoading?
                    <span className="loader-20"> </span>
                    :'Predict'
                }
            </button>
        </div>
    </>
  )
}

export default Home