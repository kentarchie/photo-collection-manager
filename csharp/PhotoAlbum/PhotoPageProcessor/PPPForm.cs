using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Web;
using System.Threading;
using PhotoPageProcessor.Properties;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace PhotoPageProcessor
{
    public partial class PPPForm : Form
    {
        public const int SAVE_INTERVAL = 30000; // every 30 seconds
        public const string FILENAME = "filename";
        public const int MESSAGE_DISPLAY_TIME = 3000;
        public const string PICTURE_EXTENSIONS = ".png,.jpg,.tiff,.gif,.bmp";

        public int PictureCounter = 0;
        public static string AlbumDirName = "";
        public static PPPForm mainForm = null;

        public Dictionary<string,string> PictureInfo;

        public static string PicturePrefix;
        public static string PagePrefix;
        public static string BackPrefix;
        public static string OrigFolder;
        public static string DefaultPictures;

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
                  //Utilities.logger("periodicSave: doing periodic save"); 
                  //if(AlbumChanged) saveTheAlbum();
            }
            catch (ThreadInterruptedException te)
            {
               //Utilities.logger("periodicSave: thread exception: "+te.ToString()); 
            }
        } // periodicSave

        private void listBox1_SelectedIndexChanged(object sender, EventArgs e)
        {
            string curItem = pageList.SelectedItem.ToString();
            displayPicture(curItem);
        } // listBox1_SelectedIndexChanged

        // start search for a folder that contains scanned pages to be processed.
        // the search begins at the DefaultPictures folder and a folder dialog is opened there
        private void loadAlbum_Click(object sender, EventArgs e)
        {
            folderBrowserDialog1.RootFolder = Environment.SpecialFolder.MyComputer;
            //MessageBox.Show("DefaultPictures=:"+DefaultPictures + ":");
            folderBrowserDialog1.SelectedPath = DefaultPictures;
            if (folderBrowserDialog1.ShowDialog() == DialogResult.OK) {  // user selected a folder
                AlbumDirName = folderBrowserDialog1.SelectedPath;
                //Utilities.logger("loadAlbum_Clicked: AlbumDirName=:" + AlbumDirName + ":");
                albumName.Text = Path.GetFileName(AlbumDirName);
                albumLoader(AlbumDirName);  // load the list of scanned pages into the list box
                displayPicture(PictureInfo.Keys.FirstOrDefault()); // set it up as if the user had clicked on the first one
            }
            //Utilities.logger("loadAlbum_Click done");
        } // loadAlbum_Click

        private void albumLoader(string dirName)
        {
            //Utilities.logger("dirName=:" + dirName + ":"); 
           
            var pictureBacks = new HashSet<string>();
            PictureInfo = new Dictionary<string,string>();

            DirectoryInfo dinfo = new DirectoryInfo(AlbumDirName); // what files are here

            // make a list of all the picture files
            string[] extensions = PICTURE_EXTENSIONS.Split(',');
            FileInfo[] files = dinfo.GetFiles()
                                    .Where(f => extensions.Contains(f.Extension.ToLower()))
                                    .ToArray();

            // Sort by creation-time descending 
            Array.Sort(files, delegate(FileInfo f1, FileInfo f2)
            {
               return f1.CreationTime.CompareTo(f2.CreationTime);
            });
            //Utilities.logger("Found " + files.Count() + " pictures");

            // make list of picture objects
            foreach (FileInfo f in files)
            {
                string fname = f.Name;
                if (fname.StartsWith(BackPrefix)) pictureBacks.Add(fname);
                if (fname.StartsWith(PagePrefix)) {
                    PictureInfo.Add(fname,"");
                }
               //Utilities.logger("Added picture " + f.Name);
            } // foreach picture loading

            // link pages to back ofpages
            foreach (FileInfo f in files)
            {
                string fname = f.Name;
                var backName = BackPrefix + fname;
                if(pictureBacks.Contains(backName))
                    PictureInfo[fname] = backName;
            }

            foreach (string f in PictureInfo.Keys)
            {
                this.pageList.Items.Add(f); // display the picture file names
            }
            
            //Utilities.logger("albumLoader done");
            //showMessage("Album Loaded");
        } // albumLoader

        private void displayPicture(string fname)
        {
            // fetch and display the image for this Picture
            var imageFileName = AlbumDirName + "\\" + fname;
            pageFileName.Text = fname;
            //MessageBox.Show("imageFileName=:"+imageFileName + ":");

            Image image = Image.FromFile(imageFileName);
           
            // To resize the image 
            var resizedImage = ScaleImage(image, pageDisplay.Width, pageDisplay.Height);
            if (pageDisplay.Image != null) pageDisplay.Image.Dispose();
            pageDisplay.Image = resizedImage;                    

            // is there a back of page image?
            if(PictureInfo[fname] != "") {
                var imageBackFileName = AlbumDirName + "\\" + PictureInfo[fname];
                Image backImage = Image.FromFile(imageBackFileName);
                var resizedBackImage = ScaleImage(backImage, pageBackDisplay.Width, pageBackDisplay.Height);
                if (pageBackDisplay.Image != null) pageBackDisplay.Image.Dispose();
                pageBackDisplay.Image = resizedBackImage;                    
                backOfPageFile.Text = fname;
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
    }
}
