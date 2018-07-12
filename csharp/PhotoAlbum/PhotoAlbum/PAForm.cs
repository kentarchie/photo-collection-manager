using System;
using System.IO;
using System.Web;
using System.Threading;
using System.Threading.Tasks;
using System.Collections;
using System.Drawing;
using System.Linq;
using System.Windows.Forms;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Emgu.CV;
using Emgu.CV.Structure;
using Emgu.CV.CvEnum;
using System.Collections.Generic;
using PhotoAlbum.Properties;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;

/*
    Format of album file
 {
    "albumname": "trip one"
    ,"pictures" : [
                     {
                        "filename"    : "APD0002.jpg"
                        ,"caption"    : "Picture 1"
                        ,"wheretaken" : "Merrill"
                        ,"whentaken"  : "Winter, 1960"
                        ,"notes"      : "This is stuff that happened \n and this is more stuff"
                     }
                     ,{
                        "filename"    : "APD0003.jpg"
                        ,"caption"    : "Picture 2"
                        ,"wheretaken" : "Merrill"
                        ,"whentaken"  : "April, 1970"
                        ,"notes"      : "A different disco version \n since it's the 70's"
                     }
    ]
 }
 */
namespace PhotoAlbum
{
    struct Album
    {
        public static string albumname = "";
        public static JArray pictures=null;
    } // Album
    
    public partial class PhotoAlbum : Form
    {
        public static JArray Pictures;
        public const int SAVE_INTERVAL = 30000; // every 30 seconds
        public const string FILENAME = "filename";
        public const string CAPTION = "caption";
        public const string WHEN_TAKEN = "whentaken";
        public const string WHERE_TAKEN = "wheretaken";
        public const string WHO = "who";
        public const string NOTES = "notes";
        public const char TAG_SEPERATOR = ',';
        public const int MESSAGE_DISPLAY_TIME = 3000;
        public const string PICTURE_EXTENSIONS = ".png,.jpg,.tiff,.gif,.bmp";

        public int PictureCounter = 0;
        public int NumPictures = 0;
        public JObject CurrentAlbum = null;
        public static string AlbumDirName = "";
        public static bool Debug = false;
        public static DebugForm debugForm = null;
        public static PhotoAlbum mainForm = null;
        bool AlbumChanged = false;
        Thread Thread1;

        public PhotoAlbum()
        {
            // main form setup
            InitializeComponent();
            mainForm = this;
            notesBox.WordWrap = true;
            whenTaken.Focus();
      
            debugForm = new DebugForm(this);
            debugForm.Hide();
            
            //Utilities.logger("PhotoAlbum: periodicSave: setup"); 
            //Thread1 = new Thread(new ThreadStart(periodicSave));
            //Thread1.Name = "periodicSave";
            //Thread1.Start();

            Utilities.logger("PhotoAlbum: Constructor Done");
        } // PhotoAlbum constructor

        public void periodicSave()
        {
            try {
                  Thread.Sleep(SAVE_INTERVAL); // every 30 seconds
                  Utilities.logger("periodicSave: doing periodic save"); 
                  if(AlbumChanged) saveTheAlbum();
            }
            catch (ThreadInterruptedException te)
            {
               MessageBox.Show("periodicSave: thread exception: "+te.ToString()); 
            }
        } // periodicSave
        
        // if the album file is present, load it
        // if not, create basic album object
        private void albumLoader(string dirName)
        {
            Utilities.logger("albumLoader: dirName=:" + dirName + ":"); 
            // find the album files, if more than one
            ArrayList albums = new ArrayList();
            foreach (string f in Directory.GetFiles(dirName, "*.album"))
                albums.Add(f);

            Utilities.logger("albumLoader: Albums count=:"+albums.Count+":"); 
            if (albums.Count > 1) { // multiple albums, choose one
                MessageBox.Show("Found more than one album file");
            }

            if (albums.Count == 1) {
                Utilities.logger("albumLoader: Album found is:" + albums[0] + ":");
                string albumText = File.ReadAllText((string)albums[0]); // load the entire file
                
                // turn the string into just JSON and parse
                // The var Album= is there so the web page can load the data file without a server
                CurrentAlbum = JObject.Parse(albumText.Replace("var Album=",""));

                Utilities.logger("albumLoader: Album File Loaded");
                albumName.Text = (string)CurrentAlbum["albumname"];
                Utilities.logger("albumLoader: albumname=:"+(string)CurrentAlbum["albumname"] +":");

                Pictures  = (JArray)CurrentAlbum["pictures"];  // get the array of picture objects
                NumPictures = Pictures.Count;
                Utilities.logger("albumLoader: NumPictures=:"+NumPictures +":");
                //Utilities.logger("Pictures[0] :"+((JObject)Pictures[0]).ToString() +":");
                //Utilities.logger("CurrentAlbum['pictures'] :"+((JObject)CurrentAlbum["pictures"][0]).ToString() +":");
                //Utilities.logger("notes for :"+(string)Pictures[0]["filename"]+": =:"+ (string)Pictures[0]["notes"] +":");

                // display picture in picker list
                foreach (JObject f in Pictures)
                {
                    string fname = (string)f[FILENAME];
                    this.listBox1.Items.Add(fname.Trim());
                }
                Utilities.logger("albumLoader: Pictures Loaded");
                showMessage("Pictures Loaded");

                // get list of existing locations
                SortedSet<string> locations = new SortedSet<string>();
                SortedSet<string> whens = new SortedSet<string>();
                foreach (JObject f in Pictures)
                {
                    string where = ((string)f[WHERE_TAKEN]).Trim();
                    string when =  ((string)f[WHEN_TAKEN]).Trim();
                    if (where.Length != 0) {
                        var parts = where.Split(TAG_SEPERATOR);
                        foreach (string s in parts) locations.Add(s);
                    }
                    if (when.Length != 0) {
                        var parts = when.Split(TAG_SEPERATOR);
                        foreach (string s in parts) whens.Add(s);
                    }
                }
                Utilities.logger("albumLoader: after where/when picture processing");

                foreach (string s in locations) whereTaken.Items.Add(s);
                foreach (string s in whens) whenTaken.Items.Add(s);
                Utilities.logger("albumLoader: after where/when lists created");
            }
            else   // no album files set up and make new one
            {
                Utilities.logger("albumLoader: No Album File");
                CurrentAlbum = new JObject();
                CurrentAlbum["albumname"] = albumName.Text;
                Pictures = new JArray();
                DirectoryInfo dinfo = new DirectoryInfo(AlbumDirName); // what files are here
                NumPictures = 0;

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
                Utilities.logger("albumLoader: Found " + files.Count() + " pictures");

                // make list of picture objects
                foreach (FileInfo f in files)
                {
                    string fname = f.Name;
                    this.listBox1.Items.Add(fname); // display the picture file names
                    JObject newPicture = new JObject();
                    newPicture[FILENAME] = fname;
                    newPicture[CAPTION] = "";
                    newPicture[WHEN_TAKEN] = "";
                    newPicture[WHERE_TAKEN] = "";
                    newPicture[WHO] = "";
                    newPicture[NOTES] = "";
                    Pictures.Add(newPicture);
                    NumPictures++;
                    Utilities.logger("albumLoader: Added picture " + f.Name);
                } // foreach picture loading
                CurrentAlbum["pictures"] = Pictures;
            }
            Utilities.logger("albumLoader: DONE");
            WebPageSetup.updateThumbnails(); // make thumbnails for each picture we found
            string albumFileName = saveTheAlbum();
            WebPageSetup.createWebPage(albumFileName); // copy web page files to the album folder
            showMessage("Album Loaded");
        } // albumLoader

        // action for loadAlbum button
        private void loadAlbum_Click(object sender, EventArgs e)
        {
            Utilities.logger("loadAlbum_Clicked: START");
            folderBrowserDialog1.RootFolder = Environment.SpecialFolder.MyComputer;
            folderBrowserDialog1.SelectedPath = @"C:\pictures";
            if (folderBrowserDialog1.ShowDialog() == DialogResult.OK) {
               AlbumDirName = folderBrowserDialog1.SelectedPath;
               Utilities.logger(string.Format("loadAlbum_Clicked: AlbumDirName=:{0}",AlbumDirName));
               albumName.Text = Path.GetFileName(AlbumDirName);
               albumLoader(AlbumDirName);
                try
                {
                    Utilities.logger("loadAlbum_Clicked: calling displayPicture(0)");
                    displayPicture(0);
                }
                catch (Exception ex)
                {
                    MessageBox.Show(string.Format("loadAlbum exception = :{0}:",ex));
                }
            }
            Utilities.logger("loadAlbum_Click done");
        } // loadAlbum_Click

        private void notesBox_TextChanged(object sender, EventArgs e)
        {
            Utilities.logger("noteBox_TextChanged: START");
            noticeChange();
        } // notesBox_TextChanged

        private void caption_TextChanged(object sender, EventArgs e)
        {
            Utilities.logger("caption_TextChanged: START");
            noticeChange();
        } // caption_TextChanged

        private void whenTaken_TextChanged(object sender, EventArgs e)
        {
            Utilities.logger("whenTaken_TextChanged: START");
            noticeChange();
        } // whenTaken_TextChanged

        private void whereTaken_TextChanged(object sender, EventArgs e)
        {
            Utilities.logger("whereTaken_TextChanged: START");
            noticeChange();
        } // whereTaken_TextChanged

        private void whoBox_TextChanged(object sender, EventArgs e)
        {
            Utilities.logger("whoBox_TextChanged: START");
            noticeChange();
        } // whoBox_TextChanged

        /* 
        Other trials
            Bitmap bitmap = new Bitmap(imageFileName);
            Image<Rgb, Byte> bitMapImage = new Image<Rgb, Byte>(bitmap);
            
            Mat matImage = CvInvoke.Imread(imageFileName, Emgu.CV.CvEnum.ImreadModes.AnyColor);
            pictureBox.Image = matImage;

            pictureBox.Image = bitMapImage;
        */

        private void displayPicture(int imageNumber)
        {
            Utilities.logger(string.Format("displayPicture start number = {0}",imageNumber));
            if((imageNumber < 0) || (imageNumber >= Pictures.Count)) {
                pictureFileName.Text = "No Picture " + imageNumber;
                return;
            }
            JObject current  = (JObject)Pictures[imageNumber];
            JObject previous = (JObject)Pictures[imageNumber];
            if(imageNumber > 1) previous = (JObject)Pictures[imageNumber-1];

            // fetch and display the image for this Picture
            string fname = (string)current[FILENAME];
            var imageFileName = AlbumDirName + "\\" + fname;
            pictureFileName.Text = fname;

            Image image = Image.FromFile(imageFileName);
            Image<Bgr, Byte> bgrImage = null;
            //Image<Bgr, Byte> bgrImage = new Image<Bgr, Byte>(imageFileName);
            //pictureBox.Image = bgrImage;
            //pictureBox.Image = image;
            //pictureBox.Refresh();

            //CascadeClassifier _cascadeClassifier;
            //_cascadeClassifier = new CascadeClassifier(Application.StartupPath + "/haarcascade_frontalface_alt_tree.xml");

            if (bgrImage != null) {
                Utilities.logger("displayPicture: bgrImage != null");
                //var grayframe = bgrImage.Convert<Gray, byte>().ConvertScale<Byte>(0,0);
                //var faces = _cascadeClassifier.DetectMultiScale(grayframe, 1.1, 10, Size.Empty); //the actual face detection happens here
                //grayframe.Dispose();

                //Utilities.logger("number of faces found=:"+ faces.Length+":");
                /*
                foreach (var face in faces)
                {
                    //the detected face(s) is highlighted here using a box that is drawn around it/them
                    bgrImage.Draw(face, new Bgr(Color.BurlyWood), 3);
                }
                */
                // https://stackoverflow.com/questions/15052419/how-to-resize-image-with-imagebox-emgucv
                // To resize the image 
                using (var resizedImage = ScaleImage(bgrImage,pictureBox2.Width, pictureBox2.Height))
                {
                    if (pictureBox2.Image != null) pictureBox2.Image.Dispose();
                    pictureBox2.Image = resizedImage;                    
                }
            }
            else {
                Utilities.logger("displayPicture: resizing Image image");
                try
                {
                    using (var resizedImage = ScaleImage(image, pictureBox.Width, pictureBox.Height))
                    {
                        //if (pictureBox.Image != null) pictureBox.Image.Dispose();
                        pictureBox.Image = resizedImage;
                        pictureBox.Refresh();
                        Utilities.logger("displayPicture: picture displayed");
                    }
                }
                catch (Exception e)
                {
                    MessageBox.Show(string.Format("resizedImage exception = :{0}:", e));
                }
            }

            listBox1.Tag = true;
            listBox1.SelectedIndex = listBox1.FindString(fname);
            listBox1.Tag = null;

            // process and display the notes and other fields
            string notes = HttpUtility.UrlDecode((string)current[NOTES]);
            notesBox.Text = notes;
            //Utilities.logger("displayPicture: decoded notes=:"+HttpUtility.UrlDecode(notes)+":");
            Utilities.logger(string.Format("displayPicture: notes=:{0}" , notes));

            string when = HttpUtility.UrlDecode((string)current[WHEN_TAKEN]);
            if(when == "") when = HttpUtility.UrlDecode((string)previous[WHEN_TAKEN]);
            whenTaken.Text = when;

            string where = HttpUtility.UrlDecode((string)current[WHERE_TAKEN]);
            if(where == "") where = HttpUtility.UrlDecode((string)previous[WHERE_TAKEN]);
            whereTaken.Text = where;

            string who = HttpUtility.UrlDecode((string)current[WHO]);
            whoBox.Text = who;

            string captionString = HttpUtility.UrlDecode((string)current[CAPTION]);
            caption.Text = captionString;
            Utilities.logger(string.Format("displayPicture: done number = {0}",imageNumber));
        } // displayPicture

        // go back and forth through the Picture list
        private void nextButton_Click(object sender, EventArgs e)
        {
            Utilities.logger("nextButton_Click: START");
            saveChanges(); 
            if (PictureCounter == NumPictures - 1)
                PictureCounter = 0;
            else
                PictureCounter++;
            Utilities.logger(string.Format("nextButton_Click: calling displayPicture({0})",PictureCounter));
            displayPicture(PictureCounter);
        } // nextButton_Click

        private void prevButton_Click(object sender, EventArgs e)
        {
            Utilities.logger("prevButton_Click: START");
            saveChanges(); 
            if (PictureCounter == 0)
                PictureCounter = NumPictures-1;
            else
                PictureCounter--;
            Utilities.logger(string.Format("prevButton_Click: calling displayPicture({0})",PictureCounter));
            displayPicture(PictureCounter);
        } // prevButton_Click

        //https://stackoverflow.com/questions/2626530/associating-keys-to-buttons-on-a-windows-form
        protected override bool ProcessCmdKey(ref Message msg, Keys keyData)
        {
            //if (keyData == (Keys.Control | Keys.F))
            if (keyData == (Keys.Right)) {
                nextButton.PerformClick();
            }
            if (keyData == (Keys.Left)) {
                prevButton.PerformClick();
            }
            return base.ProcessCmdKey(ref msg, keyData);
        }

        // form window settings stuff from here
        //https://www.arclab.com/en/kb/csharp/save-and-restore-position-size-windows-forms-application.html
        private void Form1_Load(object sender, EventArgs e)
        {
            Utilities.logger("Form1_Load: START");
            if (Properties.Settings.Default.F1Size.Width == 0 || Properties.Settings.Default.F1Size.Height == 0)
            {
                // first start
                // optional: add default values
            }
            else
            {
                this.WindowState = Properties.Settings.Default.F1State;

                // we don't want a minimized window at startup
                if (this.WindowState == FormWindowState.Minimized) this.WindowState = FormWindowState.Normal;

                this.Location = Properties.Settings.Default.F1Location;
                this.Size = Properties.Settings.Default.F1Size;
            }
            Utilities.logger("Form1_Load: DONE");
        } // Form1_Load

        private void PhotoAlbum_FormClosing(object sender, FormClosingEventArgs e)
        {
            Utilities.logger("PhotoAlbum_FormClosing: START");
            Properties.Settings.Default.F1State = this.WindowState;
            if (this.WindowState == FormWindowState.Normal)
            {
                // save location and size if the state is normal
                Properties.Settings.Default.F1Location = this.Location;
                Properties.Settings.Default.F1Size = this.Size;
            }
            else
            {
                // save the RestoreBounds if the form is minimized or maximized!
                Properties.Settings.Default.F1Location = this.RestoreBounds.Location;
                Properties.Settings.Default.F1Size = this.RestoreBounds.Size;
            }

            if(Thread1 != null)
            {
                Utilities.logger("PhotoAlbum_FormClosing: Thread1 NOT null");
                if (Thread1.IsAlive)
                {
                    Utilities.logger("PhotoAlbum_FormClosing: Thread1 alive");
                    Thread1.Abort("Done Running");
                    Thread1.Join();
                }
                else
                {
                    Utilities.logger("PhotoAlbum_FormClosing: Thread1 NOT alive");
                }
            } 
            else
            {
                Utilities.logger("PhotoAlbum_FormClosing: Thread1 null");
            }

            // don't forget to save the settings
            Properties.Settings.Default.Save();
            //MessageBox.Show("form closing finished", "title",MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
        } // PhotoAlbum_FormClosing

        // update the data structure for the current picture
        private void saveChanges()
        {
            string note = notesBox.Text;
            Pictures[PictureCounter][NOTES] =       HttpUtility.UrlEncode(note);
            Pictures[PictureCounter][WHEN_TAKEN] =  HttpUtility.UrlEncode(whenTaken.Text);
            Pictures[PictureCounter][WHERE_TAKEN] = HttpUtility.UrlEncode(whereTaken.Text);
            Pictures[PictureCounter][WHO] = HttpUtility.UrlEncode(whoBox.Text);
            Pictures[PictureCounter][CAPTION] =     HttpUtility.UrlEncode(caption.Text);
            //Utilities.logger("date for:" + PictureCounter + ": saved");
        }  // saveChanges
        
        private void listBox1_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (listBox1.Tag != null) return;
            Utilities.logger("listBox1_SelectedIndexChanged: START");
            string curItem = listBox1.SelectedItem.ToString(); 
            int count = 0;
            // find the chosen picture in the list
            foreach (JObject f in Pictures) {
                if ((string) f[FILENAME] == curItem) {
                    PictureCounter = count;
                    break;
                }
                count++;
            }
            Utilities.logger(string.Format("listBox1_SelectedIndexChanged: calling displayPicture({0})", PictureCounter));
            displayPicture(PictureCounter);
        } // listBox1_SelectedIndexChanged

        // generate the JSON data file for the album
        private String saveTheAlbum()
        {
            Utilities.logger("saveTheAlbum: saving album");
            AlbumStatus.BackColor = Color.Red;
            AlbumStatus.Text = "Saving";
            saveChanges();
            string json = JsonConvert.SerializeObject(CurrentAlbum,Formatting.Indented); // internal structure to JSON
            string folderName = Path.GetFileName(AlbumDirName);
            string albumFileName = AlbumDirName + "\\" + folderName +".album";
            System.IO.StreamWriter SaveFile = new System.IO.StreamWriter(albumFileName);
            SaveFile.WriteLine("var Album=" + json); //Writes the text to the file
            SaveFile.Close();
            AlbumStatus.BackColor = Color.Lime;
            AlbumStatus.Text = "Saved";
            AlbumChanged = false;
            Utilities.logger("album saved");
            displayMessage("Album Saved");
            return folderName;
        } // saveTheAlbum

        private void displayMessage(string str)
        {
            messages.Text = str;
        } // displayMessage

        // what to do when something changes
        private void noticeChange()
        {
            Utilities.logger("noticeChange: START");
            //saveNoteButton.BackColor = Color.Red;
            FormStatus.BackColor = Color.Red;
            FormStatus.Text = "Saving";
            saveChanges();
            AlbumChanged = true;
            FormStatus.BackColor = Color.Lime;
            FormStatus.Text = "Saved";
        } // noticeChange

        // timer stuff from
        // http://stackoverflow.com/questions/13740629/how-do-i-trigger-a-method-to-run-after-x-seconds?rq=1
        private void showMessage(string str)
        {
            message.Text = str;
            Task.Factory.StartNew(() => Thread.Sleep(MESSAGE_DISPLAY_TIME))
            .ContinueWith((t) =>
            {
                message.Text = "";
            }, TaskScheduler.FromCurrentSynchronizationContext());
        } // showMessage

        // show/hide the logging control
        public void debugSwitch_Click(object sender, EventArgs e)
        {
            if (debugSwitch.Text.Contains("Off"))
            {
                Debug = true;
                debugSwitch.Text = debugSwitch.Text.Replace("Off", "On");
                debugSwitch.BackColor = Color.Red;
                debugForm.Show();
                Utilities.logger("debugSwitch_Click: Logging Start");
            }
            else
            {
                Debug = false;
                debugSwitch.Text = debugSwitch.Text.Replace("On", "Off");
                debugSwitch.BackColor = Color.Lime;
                debugForm.Hide();
            }
        } // debugSwitch

        private void savedStatus_Click(object sender, EventArgs e)
        {

        } // savedStatus

        private void saveAlbum_Click(object sender, EventArgs e)
        {
            saveTheAlbum();
        }

        // based on https://stackoverflow.com/questions/6501797/resize-image-proportionally-with-maxheight-and-maxwidth-constraints
        public static Image<Bgr, Byte> ScaleImage(Image<Bgr, Byte> image, int maxWidth, int maxHeight)
        {
            Utilities.logger("ScaleImage: START Image<Bgr, Byte> ");
            var ratioX = (double)maxWidth / image.Width;
            var ratioY = (double)maxHeight / image.Height;
            var ratio = Math.Min(ratioX, ratioY);

            var newWidth = (int)(image.Width * ratio);
            var newHeight = (int)(image.Height * ratio);

            var newImage = image.Resize(newWidth, newHeight, Inter.Linear);

            return newImage;
        } // ScaleImage

        // based on https://stackoverflow.com/questions/6501797/resize-image-proportionally-with-maxheight-and-maxwidth-constraints
        public static Image ScaleImage(Image image, int maxWidth, int maxHeight)
        {
            Utilities.logger("ScaleImage: START Image");
            double ratioX=0.0, ratioY=0.0, ratio=0.0;

            int newWidth = 0, newHeight = 0;
            try
            {
                ratioX = (double)maxWidth / image.Width;
                ratioY = (double)maxHeight / image.Height;
                ratio = Math.Min(ratioX, ratioY);
    
                newWidth = (int)(image.Width * ratio);
                newHeight = (int)(image.Height * ratio);
            }
            catch (Exception e)
            {
                MessageBox.Show(string.Format("scaleImage Image: get sizes exception = :{0}:", e));
            }
            Utilities.logger("scaleimage Image: after widths");

            //var newImage = image.Resize(newWidth, newHeight, Inter.Linear);
            Bitmap newImage = null;
            try
            {
                newImage = ResizeImage(image, newWidth, newHeight);
                Utilities.logger("scaleImage Image: after ResizeImage");
            }
            catch (Exception e)
            {
                MessageBox.Show(string.Format("resize exception = :{0}:", e));
            }

            return newImage;
        } // ScaleImage

        /// <summary>
        /// 
        /// https://stackoverflow.com/questions/1922040/resize-an-image-c-sharp
        /// Resize the image to the specified width and height.
        /// </summary>
        /// <param name="image">The image to resize.</param>
        /// <param name="width">The width to resize to.</param>
        /// <param name="height">The height to resize to.</param>
        /// <returns>The resized image.</returns>
        public static Bitmap ResizeImage(Image image, int width, int height)
        {
            Utilities.logger("ResizeImage: START");
            var destRect = new Rectangle(0, 0, width, height);
            var destImage = new Bitmap(width, height);

            destImage.SetResolution(image.HorizontalResolution, image.VerticalResolution);
            Utilities.logger("ResizeImage: after set resolution");

            using (var graphics = Graphics.FromImage(destImage))
            {
                graphics.CompositingMode = CompositingMode.SourceCopy;
                graphics.CompositingQuality = CompositingQuality.HighQuality;
                graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                graphics.SmoothingMode = SmoothingMode.HighQuality;
                graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;
                Utilities.logger("ResizeImage: after set graphics");

                try
                {
                    using (var wrapMode = new ImageAttributes())
                    {
                        wrapMode.SetWrapMode(WrapMode.TileFlipXY);
                        graphics.DrawImage(image, destRect, 0, 0, image.Width, image.Height, GraphicsUnit.Pixel, wrapMode);
                        Utilities.logger("ResizeImage: after drawImage");
                    }
                }
                catch (Exception e)
                {
                    MessageBox.Show(string.Format(" ResizeImage: Inner Exception = :{0}:",e));
                }
            }

            return destImage;
        }

        private void OpenDatePicker_Click(object sender, EventArgs e)
        {
            using (var form = new VagueDate())
            {
                var result = form.ShowDialog();
                if(result == DialogResult.OK) {
                    var vagueDate = form.ReturnVagueDate;
                    this.whenTaken.Text = vagueDate;
                }
            }
        }

        private void SettingsButton_Click(object sender, EventArgs e)
        {
            using (var form = new UserSettings())
            {
                var result = form.ShowDialog();
                if(result == DialogResult.OK) {
                }
            }
        } // SettingsButton_Click
    }// class PhotoAlbum
} // namespace PhotoAlbum