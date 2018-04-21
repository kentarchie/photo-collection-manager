using System;
using System.IO;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Windows.Forms;
using System.Threading;
using System.Drawing.Imaging;

namespace PhotoPageProcessor
{
    public partial class PPPForm : Form
    {
        public const int SAVE_INTERVAL = 30000; // every 30 seconds
        public const int MESSAGE_DISPLAY_TIME = 3000;
        public const string PICTURE_EXTENSIONS = ".png,.jpg,.tiff,.gif,.bmp";

        public int PictureCounter = 0;
        public static string AlbumDirName = "";
        public static PPPForm mainForm = null;

        public Dictionary<string,string> PictureInfo;
        public string CurrentPage = "";

        public static string PicturePrefix;
        public static string PagePrefix;
        public static string BackPrefix;
        public static string OrigFolder;
        public static string DefaultPictures;

        // The original image.
        public static Bitmap OriginalImage;

        // True when we're selecting a rectangle.
        public static bool IsSelecting = false;

        // The area we are selecting.
        public static int X0, Y0, X1, Y1;
        //private PPPForm mainForm;

        bool AlbumChanged = false;
        Thread Thread1;

        public PPPForm()
        {
            InitializeComponent();
            loadSettings();
            Thread1 = new Thread(new ThreadStart(periodicSave));
            Thread1.Name = "periodicSave";
            Thread1.Start();
            mainForm = this;

            if(Thread1.IsAlive) Thread1.Abort("Done Running");
            if(Thread1.IsAlive) Thread1.Join();
        }

        public void loadSettings()
        {
            PicturePrefix = PhotoPageProcessor.Properties.Settings.Default.PicturePrefix;
            PagePrefix = PhotoPageProcessor.Properties.Settings.Default.PagePrefix;
            BackPrefix = PhotoPageProcessor.Properties.Settings.Default.BackPrefix;
            OrigFolder = PhotoPageProcessor.Properties.Settings.Default.OrigFolder;
            DefaultPictures = PhotoPageProcessor.Properties.Settings.Default.DefaultPictures;
            showPicturePrefix.Text = PicturePrefix;
            showPagePrefix.Text = PagePrefix;
            showBackOfPrefix.Text = BackPrefix;
            showOrigFolder.Text = OrigFolder;
            showDefaultPictures.Text = DefaultPictures;
        } // loadSettings

        public void periodicSave()
        {
            try {
                  Thread.Sleep(SAVE_INTERVAL); // every 30 seconds
                  //if(AlbumChanged) saveTheAlbum();
            }
            catch (ThreadInterruptedException te)
            {
            }
        } // periodicSave

        private void listBox1_SelectedIndexChanged(object sender, EventArgs e)
        {
            CurrentPage = pageList.SelectedItem.ToString();
            displayPicture(CurrentPage);
        } // listBox1_SelectedIndexChanged

        private string getNextPage()
        {
            var keys = PictureInfo.Keys.ToList<string>();
            int index1 = keys.IndexOf(CurrentPage);
            var nextKey = keys[index1 + 1];
            MessageBox.Show("nextKey=:"+nextKey + ":");
            return (nextKey);
        } // getNextPage

        // start search for a folder that contains scanned pages to be processed.
        // the search begins at the DefaultPictures folder and a folder dialog is opened there
        private void loadAlbum_Click(object sender, EventArgs e)
        {
            folderBrowserDialog1.RootFolder = Environment.SpecialFolder.MyComputer;
            //MessageBox.Show("DefaultPictures=:"+DefaultPictures + ":");
            folderBrowserDialog1.SelectedPath = DefaultPictures;
            if (folderBrowserDialog1.ShowDialog() == DialogResult.OK) {  // user selected a folder
                AlbumDirName = folderBrowserDialog1.SelectedPath;
                albumName.Text = Path.GetFullPath(folderBrowserDialog1.SelectedPath);
                //albumName.Text = Path.GetFileName(AlbumDirName);
                albumLoader(AlbumDirName);  // load the list of scanned pages into the list box
                CurrentPage = PictureInfo.Keys.FirstOrDefault(); // set it up as if the user had clicked on the first one
                displayPicture(CurrentPage); // set it up as if the user had clicked on the first one
            }
        } // loadAlbum_Click

        private void albumLoader(string dirName)
        {
            var pictureBacks = new HashSet<string>();
            PictureInfo = new Dictionary<string,string>();

            DirectoryInfo dinfo = new DirectoryInfo(AlbumDirName); // what files are here

            // make a list of all the picture files
            string[] extensions = PICTURE_EXTENSIONS.Split(','); // list of file extensions for photos
            FileInfo[] files = dinfo.GetFiles()
                                    .Where(f => extensions.Contains(f.Extension.ToLower()))
                                    .ToArray();

            // Sort by name descending 
            Array.Sort(files, delegate(FileInfo f1, FileInfo f2)
                    {
                        return f1.Name.CompareTo(f2.Name);
                    }
            );

            // make list of picture objects
            foreach (FileInfo f in files)
            {
                string fname = f.Name;
                if (fname.StartsWith(PagePrefix)) PictureInfo.Add(fname,"");
                if (fname.StartsWith(BackPrefix)) pictureBacks.Add(fname);
            } // foreach picture loading
            //MessageBox.Show("PictureInfo.Count=:"+PictureInfo.Count + ": pictureBacks.Count=:"+pictureBacks.Count + ":");

            // link pages to back ofpages
            string[] keys = new string[PictureInfo.Keys.Count];
            PictureInfo.Keys.CopyTo(keys,0);
            foreach (string fname in keys)
            {
                var backName = BackPrefix + fname;
                if(pictureBacks.Contains(backName))
                    PictureInfo[fname] = backName;
            }

            foreach (string f in PictureInfo.Keys)
            {
                pageList.Items.Add(f); // display the picture file names
            }
            getInitialPictureNumber();
        } // albumLoader
        
        private void getInitialPictureNumber()
        {
            DirectoryInfo dinfo = new DirectoryInfo(AlbumDirName); // what files are here

            // make a list of all the picture files
            string[] extensions = PICTURE_EXTENSIONS.Split(','); // list of file extensions for photos
            FileInfo[] files = dinfo.GetFiles()
                                    .Where(f => extensions.Contains(f.Extension.ToLower()) && f.Name.StartsWith(PicturePrefix))
                                    .ToArray();
            PictureCounter = files.Length + 1;
        } // getInitialPictureNumber

        private void updatePicture(string fname, Label fileNameLabel, RickApps.CropImage.RubberBand imageBox)
        {
            var imageFileName = AlbumDirName + "\\" + fname;
            fileNameLabel.Text = fname;
            Image image = Image.FromFile(imageFileName);
            var resizedImage = ScaleImage(image, imageBox.Width, imageBox.Height);
            if ( imageBox.Image != null) imageBox.Image.Dispose();
            imageBox.Image = resizedImage; // resizedImage;                    
            image.Dispose();
        } // updatePicture

        private void displayPicture(string fname)
        {
            // fetch and display the image for this Picture
            updatePicture(fname, pageFileName, pageDisplay);

            // is there a back of page image?
            if(PictureInfo[fname] != "") {
                updatePicture(PictureInfo[fname], backOfPageFile, pageBackDisplay);
            }
            
            pageList.SelectedIndex = pageList.FindString(fname);
        } // displayPicture

        // based on https://stackoverflow.com/questions/6501797/resize-image-proportionally-with-maxheight-and-maxwidth-constraints
        // https://stackoverflow.com/questions/15052419/how-to-resize-image-with-imagebox-emgucv
        public static Image ScaleImage(Image image, int maxWidth, int maxHeight)
        {
            var ratioX = (double)maxWidth / image.Width;
            var ratioY = (double)maxHeight / image.Height;
            var ratio = Math.Min(ratioX, ratioY);

            var newWidth  = (int)(image.Width * ratio);
            var newHeight = (int)(image.Height * ratio);

            var newImage = new Bitmap(newWidth, newHeight);

            using (var graphics = Graphics.FromImage(newImage))
                graphics.DrawImage(image, 0, 0, newWidth, newHeight);

            return newImage;
        } // ScaleImage

        // pop up a form to set preferences
        private void UserSettings_Click(object sender, EventArgs e)
        {
            using (var form = new UserSettings())
            {
                var result = form.ShowDialog();
                if (result == DialogResult.OK)
                {
                }
            }
        }

        // when application is started, set the screen size to what it was when last used
        private void PPPForm_Load(object sender, EventArgs e)
        {
            if (Properties.Settings.Default.F1Size.Width == 0 || Properties.Settings.Default.F1Size.Height == 0) {
                // first start
                // optional: add default values
            }
            else {
                this.WindowState = Properties.Settings.Default.F1State;

                // we don't want a minimized window at startup
                if (this.WindowState == FormWindowState.Minimized) this.WindowState = FormWindowState.Normal;

                this.Location = Properties.Settings.Default.F1Location;
                this.Size = Properties.Settings.Default.F1Size;
            }
        } // PPPForm_Load

        // save form size and location before closing the window
        private void PPPForm_FormClosing(object sender, FormClosingEventArgs e)
        {
            Properties.Settings.Default.F1State = this.WindowState;
            if (this.WindowState == FormWindowState.Normal) {
                // save location and size if the state is normal
                Properties.Settings.Default.F1Location = this.Location;
                Properties.Settings.Default.F1Size = this.Size;
            }
            else {
                // save the RestoreBounds if the form is minimized or maximized!
                Properties.Settings.Default.F1Location = this.RestoreBounds.Location;
                Properties.Settings.Default.F1Size = this.RestoreBounds.Size;
            }

            // don't forget to save the settings
            Properties.Settings.Default.Save();
        } // PPPForm_FormClosing

        private void rotatePage_Click(object sender, EventArgs e)
        {
            var pageImage = pageDisplay.Image;
            pageImage.RotateFlip(RotateFlipType.Rotate180FlipNone);
            pageDisplay.Image = pageImage;
            var pagebackImage = pageBackDisplay.Image;
            pagebackImage.RotateFlip(RotateFlipType.Rotate180FlipNone);
            pageBackDisplay.Image = pagebackImage;
        }

        private void clipImage_Click(object sender, EventArgs e)
        {
            OriginalImage = new Bitmap(pageDisplay.Image);
            //MessageBox.Show("clipImage clicked");
        } // clipImage_Click

        private string makePictureCounterString()
        {
            if (PictureCounter >= 100) return PictureCounter.ToString();
            if (PictureCounter >= 10) return "0" + PictureCounter.ToString();
            return "00" + PictureCounter.ToString();
        } // makPictureString

        private void pageDone_Click(object sender, EventArgs e)
        {
            var thisFileName = pageFileName.Text;
            var backFileName = string.Format("{0}{1}", BackPrefix, thisFileName);
            var dirPath = string.Format("{0}/{1}",albumName.Text, OrigFolder);
            var filePath = string.Format("{0}/{1}",albumName.Text, thisFileName);
            var newFilePath = string.Format("{0}/{1}",dirPath, thisFileName);
            var backFilePath = string.Format("{0}/{1}",albumName.Text, backFileName);
            var newBackFilePath = string.Format("{0}/{1}",dirPath, backFileName);
            var unsavedCount = Int32.Parse(unsavedPictures.Text);
            if(unsavedCount > 0) {
                var confirmResult = MessageBox.Show("There may be unsaved pictures in this page, are you sure you want to mark it done?",
                                     "Confirm Marking It Done!!",
                                     MessageBoxButtons.YesNo);
                if (confirmResult != DialogResult.Yes) {
                    return;
                }
            }

            if (pageDisplay.Image != null) pageDisplay.Image.Dispose();
            displayPicture(getNextPage());
            Directory.CreateDirectory(dirPath);
            //MessageBox.Show("filePath=:"+filePath + ":");
            //MessageBox.Show("newFilePath=:"+newFilePath + ":");
            File.Move(filePath, newFilePath);
            if(File.Exists(backFilePath)) {
                File.Move(backFilePath, newBackFilePath);
            }
            MessageBox.Show("pageDone done");
        } // pageDone

        private void rotateLeft_Click(object sender, EventArgs e)
        {
            var pageImage = clippedImage.Image;
            pageImage.RotateFlip(RotateFlipType.Rotate270FlipNone);
            clippedImage.Image = pageImage;
        } // rotateLeft_Click

        private void rotateRight_Click(object sender, EventArgs e)
        {
            var pageImage = clippedImage.Image;
            pageImage.RotateFlip(RotateFlipType.Rotate90FlipNone);
            clippedImage.Image = pageImage;
        } // rotateRight_Click

        private void saveClip_Click(object sender, EventArgs e)
        {
            var path = string.Format("{0}/{1}",albumName.Text,pictureFileName.Text);
            MessageBox.Show("path =" + path);
            // MessageBox.Show("clippedImage.type =" + clippedImage.Image.GetType());
            var i2 = new Bitmap(clippedImage.Image);
            i2.Save(path, ImageFormat.Png);
            var pixLeft = Int32.Parse(unsavedPictures.Text);
            if (pixLeft > 0) pixLeft--;
            unsavedPictures.Text = pixLeft.ToString();
            clipStatus.Text = "Picture Saved";
        } // saveClip_Click

        private void pixPerPage_ValueChanged(object sender, EventArgs e)
        {
            unsavedPictures.Text = pixPerPage.Value.ToString();
        } // pixPerPage_ValueChanged

        private void addBackText_Click(object sender, EventArgs e)
        {
            string promptValue = Prompt.ShowDialog("Enter Text From The Back Of This Picture", "Back Of Picture Text");
            MessageBox.Show(string.Format("back text :{0}: ",promptValue));
        }

        // what to do when a piece of a page is selected
        // image selection control is from
        // https://github.com/rickapps/crop-image-control
        private void OnImageCropped(object sender, EventArgs e)
        {
            // Get the cropped portion of our image
            Image croppedImage = pageDisplay.SelectedImage;
            //MessageBox.Show("Image copied to your clipboard");
            clippedImage.Image = croppedImage;
            clipStatus.Text = "Picture UnSaved";
            pictureFileName.Text = string.Format("{0}{1}.png",showPicturePrefix.Text,makePictureCounterString());
        } // OnImageCropped

    } // class PPPForm
} // PhotoPageProcessor