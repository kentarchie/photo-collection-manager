import os
import sys
import json
from pathlib import Path
import cv2
from PIL import Image

PATH_TO_DATA_FILES = os.path.dirname(sys.argv[0])
CASC_PATH = os.path.join(PATH_TO_DATA_FILES, "haarcascade_frontalface_default.xml")
INCLUDED_EXTENSIONS = ["jpg", "bmp", "png", "gif"]
THUMB_NAILS = "thumbnails"
BIG_PIC_SCALE = 0.10
SMALL_PIC_SCALE = 0.25

FULL_ALBUM_PATH = ""
ALBUM_NAME = ""
ALBUM_DATA = {}
FACE_CASCADE = ""

def initializeAlbumData():
	"""
		check if the foldername.json file exists
 		if it does, load it into the album data object
 		if not, create a new empty one and save the file
	"""
	global FULL_ALBUM_PATH, ALBUM_NAME, ALBUM_DATA
	FULL_ALBUM_PATH = os.getcwd()
	ALBUM_NAME = os.path.basename(FULL_ALBUM_PATH)
	print("ALBUM_NAME {0}".format(ALBUM_NAME))
	fullAlbumName = os.path.join(FULL_ALBUM_PATH, ALBUM_NAME+".json")
	albumFile = Path(fullAlbumName)
	if  albumFile.is_file():
		print("trying to open file {0}".format(fullAlbumName))
		with open('.\{0}.json'.format(ALBUM_NAME)) as jsonData:
			ALBUM_DATA = json.load(jsonData,)
	else:
		print("ALBUM_NAME {0} NOT FOUND".format(ALBUM_NAME))
		ALBUM_DATA = {}
		ALBUM_DATA['album'] = ALBUM_NAME
		ALBUM_DATA['albumPath'] = FULL_ALBUM_PATH
		ALBUM_DATA['images'] = {}
		print(json.dumps(ALBUM_DATA))

	if(not os.path.isdir(THUMB_NAILS)):
		os.mkdir("./" + THUMB_NAILS)
	return ""

def getFaces(filePath, image):
	global FACE_CASCADE
	print("read image {0}".format(filePath))
	gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
	print("got gray version {0}".format(filePath))

# Detect faces in the image
	faces = FACE_CASCADE.detectMultiScale(gray, scaleFactor=1.03, minNeighbors=20, minSize=(30, 70))
	print("Found {0} faces!".format(len(faces)))
	return faces

def showFaces(faces, image):
	# Draw a rectangle around the faces
	for (xPos, yPos, faceWidth, faceHeight) in faces:
		cv2.rectangle(image, (xPos, yPos), (xPos+faceWidth+35, yPos+faceHeight+35), (0, 0, 255), thickness=10)
	#cv2.imshow("Faces found", image)
	cv2Im = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
	pilIm = Image.fromarray(cv2Im)
	pilIm.show()
	#cv2.waitKey(0)

def processImage(imageFileName):
	fullFileName = FULL_ALBUM_PATH + "/" + imageFileName
	image = cv2.imread(fullFileName)
	ALBUM_DATA['images'][imageFileName] = {}
	ALBUM_DATA['images'][imageFileName]['filename'] = fullFileName
	print("working on {0}".format(fullFileName))
	faces = getFaces(fullFileName, image)
	showFaces(faces, image)
	#print(json.dumps(albumData))

def saveAlbumData(albumData):
	fullAlbumName = os.path.join(FULL_ALBUM_PATH, ALBUM_NAME+".json")
	albumFile = open(fullAlbumName, "w")
	albumFile.write(json.dumps(albumData))
	albumFile.close() 

def main():
	global FACE_CASCADE
	print("program Start")
	print("argv[0] = :{0}:".format(sys.argv[0]))
	#print("basename argv[0]=:{0}:".format(os.path.basename(sys.argv[0])))
	#print("dirname argv[0]=:{0}:".format(os.path.dirname(sys.argv[0])))

	# Create the haar cascade
	FACE_CASCADE = cv2.CascadeClassifier(CASC_PATH)
	initializeAlbumData()
	#print("START: {0}".format(json.dumps(ALBUM_DATA)))

	# get the list of image files in the current directory
	imageList = [fn for fn in os.listdir(FULL_ALBUM_PATH)
						if any(fn.endswith(ext) for ext in INCLUDED_EXTENSIONS)]

	if imageList.count == 0:
		print("No images found in folder {0}", FULL_ALBUM_PATH)
		exit()

	for fileName in imageList:
		fullFileName = FULL_ALBUM_PATH + "/" + fileName
		fileSize = os.path.getsize(fullFileName)

		image = cv2.imread(fullFileName)
		ALBUM_DATA['images'][fileName] = {}
		imageData = ALBUM_DATA['images'][fileName]
		imageData['filename'] = fullFileName
		height, width, channels = image.shape
		imageData['originalWidth'] = width
		imageData['originalHeight'] = height
		imageData['channels'] = channels
		imageData['fileSize'] = fileSize

		# these will be filled in later
		imageData['whenTaken'] = ""
		imageData['whereTaken'] = ""
		imageData['notes'] = ""
		imageData['caption'] = ""

		# make thumbnail
		thumbnailPath = "%s/%s" % (THUMB_NAILS, fileName)
		print("thumbnail path {0}".format(thumbnailPath))
		#cv2Im = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
		#pilIm = Image.fromarray(cv2Im)
		#thumb = Image.open(pilIm).thumbnail((100, 100))
		#thumb.save(thumbnailPath)

		thumbScale = BIG_PIC_SCALE if imageData['originalWidth'] > 2000 else SMALL_PIC_SCALE
		thumbWidth = int(imageData['originalWidth'] * thumbScale)
		thumbHeight = int(imageData['originalHeight'] * thumbScale)

		imageData['thumbScale'] = thumbScale
		imageData['thumbWidth'] = thumbWidth
		imageData['thumbHeight'] = thumbHeight
		imRes = cv2.resize(image, (thumbWidth, thumbHeight), interpolation=cv2.INTER_AREA)
		cv2.imwrite(thumbnailPath, imRes);

		print("working on {0}".format(fullFileName))
		imageData['faces'] = {}
		imageData['faces']['numberFaces'] = 0
		imageData['faces']['faceList'] = []
		faces = getFaces(fullFileName, image)
		for (xPos, yPos, faceWidth, faceHeight) in faces:
			#print("faceData: {0} xPos{1} yPos{2} faceWidth{3} faceHeight{4}".format(fileName, xPos, yPos, faceWidth, faceHeight))
			face = {}
			face["startX"] = xPos.item()
			face["startY"] = yPos.item()
			face["width"] = faceWidth.item()
			face["height"] = faceHeight.item()
			face["firstName"] = ""
			face["lastName"] = ""
			imageData['faces']['faceList'].append(face)
		imageData['faces']['numberFaces'] = len(imageData['faces']['faceList'])
	print(json.dumps(ALBUM_DATA))
	saveAlbumData(ALBUM_DATA)

main()

# https://stackoverflow.com/questions/2225564/get-a-filtered-list-of-files-in-a-directory
