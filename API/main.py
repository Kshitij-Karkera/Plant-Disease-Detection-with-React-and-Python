from fastapi import FastAPI, File, UploadFile
import numpy as np
from io import BytesIO
from PIL import Image
import torch
from torch import nn
import matplotlib.pyplot as plt
import os
import io
import torchvision
import torchvision.transforms as transforms
from torchvision.transforms import Resize
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class_names = ['Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy', 'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew','Cherry_(including_sour)___healthy', 'Corn_(maize)___Cercospora_leaf_spot_Gray_leaf_spot', 'Corn_(maize)___Common_rust_', 'Corn_(maize)___Northern_Leaf_Blight','Corn_(maize)___healthy', 'Grape___Black_rot', 'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 'Grape___healthy','Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot', 'Peach___healthy', 'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy','Potato___Early_blight', 'Potato___Late_blight','Potato___healthy', 'Raspberry___healthy', 'Soybean___healthy', 'Squash___Powdery_mildew', 'Strawberry___Leaf_scorch', 'Strawberry___healthy', 'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight', 'Tomato___Leaf_Mold','Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites_Two-spotted_spider_mite', 'Tomato___Target_Spot','Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus', 'Tomato___healthy']

def get_default_device():
    if torch.cuda.is_available:
        return torch.device("cuda")
    else:
        return torch.device("GPU")
dev = get_default_device()

class ResNet9(nn.Module):
    def __init__(self, in_channels, num_diseases):
        super().__init__()
        
        self.conv1 = ConvBlock(in_channels, 64)
        self.conv2 = ConvBlock(64, 128, pool=True)  
        self.res1 = nn.Sequential(ConvBlock(128, 128), ConvBlock(128, 128))
        
        self.conv3 = ConvBlock(128, 256, pool=True)
        self.conv4 = ConvBlock(256, 512, pool=True)
        self.res2 = nn.Sequential(ConvBlock(512, 512), ConvBlock(512, 512))
        
        self.classifier = nn.Sequential(nn.MaxPool2d(4),
                                       nn.Flatten(),
                                       nn.Linear(512, num_diseases))
        
    def forward(self, xb):
        use_cuda = False
        out = self.conv1(xb)
        out = self.conv2(out)
        out = self.res1(out) + out
        out = self.conv3(out)
        out = self.conv4(out)
        out = self.res2(out) + out
        out = self.classifier(out)
        return out        

def ConvBlock(in_channels, out_channels, pool=False):
    layers = [nn.Conv2d(in_channels, out_channels, kernel_size=3, padding=1),
              nn.BatchNorm2d(out_channels),
              nn.ReLU(inplace=True)]
    if pool:
        layers.append(nn.MaxPool2d(4))
    return nn.Sequential(*layers)

def to_device(data, device):
    if isinstance(data, (list,tuple)):
        return [to_device(x, device) for x in data]
    return data.to(device, non_blocking=True)

model = to_device(ResNet9(3, len(class_names)), dev)
#PATH = os.path('')
model.load_state_dict(torch.load("../Models/Fin_Plant_Model.pth",map_location=torch.device(dev)))
model.eval()
#model = torch.load('../Model/plant_model2.pth', map_location=torch.device('cuda'))
def read_file_as_image(data):
	#image = torchvision.transforms.ToPILImage()(data)
	data = np.array(Image.open(BytesIO(data)))
	#image = torch.from_numpy(data).long()
	#image = Image.open(io.BytesIO(data))
	#image = image.resize((256,256))
	convert_tensor = transforms.ToTensor()
	image = convert_tensor(data)
	#image = np.expand_dims(data,0)
	return image

@app.post("/predict")
async def predict( file: UploadFile = File(...)):
	img = read_file_as_image(await file.read())
	xb = to_device(img.unsqueeze(0), dev)
	resize = Resize((256,256))
	xb = resize(xb)
	yb = model(xb)
	_, preds  = torch.max(yb, dim=1)

	newpreds = torch.nn.functional.softmax(yb,dim = 1) * 100
	maxpredcon = torch.max(newpreds,dim=1)
	confidencelev = maxpredcon[0].item()

	print(confidencelev)
	return {
            "class":preds[0].item(),
            "Confidence":confidencelev
            }