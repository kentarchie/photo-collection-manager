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
            notesBox.WordWrap = true;
      
            debugForm = new DebugForm();
            debugForm.Hide();

            whenTaken.Focus();
            
            Utilities.logger("periodicSave: setup"); 
            Thread1 = new Thread(new ThreadStart(periodicSave));
            Thread1.Name = "periodicSave";
            Thread1.Start();
            mainForm = this;

            if(Thread1.IsAlive) Thread1.Abort("Done Running");
            if(Thread1.IsAlive) Thread1.Join();
            
            //listBox1.Anchor =    (AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Bottom | AnchorStyles.Right);
            //listBox1.Anchor =    (AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Bottom | AnchorStyles.Right);
            //pictureBox1.Anchor = (AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Bottom | AnchorStyles.Right);
            //notesBox.Anchor =    (AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Bottom | AnchorStyles.Right);
            //logBox.Anchor =      (AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Bottom | AnchorStyles.Right);
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
               Utilities.logger("periodicSave: thread exception: "+te.ToString()); 
            }
        } // periodicSave
        
        // if the album file is present, load it
        // if not, create basic album object
        private void albumLoader(string dirName)
        {
            Utilities.logger("dirName=:" + dirName + ":"); 
            // find the album files, if more than one
            ArrayList albums = new ArrayList();
            foreach (string f in Directory.GetFiles(dirName, "*.album"))
                albums.Add(f);

            Utilities.logger("Albums count=:"+albums.Count+":"); 
            if (albums.Count > 1) { // multiple albums, choose one
                MessageBox.Show("Found more than one albm file");
            }

            if (albums.Count == 1) {
                Utilities.logger("Album found is:" + albums[0] + ":");
                string albumText = File.ReadAllText((string)albums[0]); // load the entire file
                
                // turn the string into just JSON and parse
                CurrentAlbum = JObject.Parse(albumText.Replace("var Album=",""));

                Utilities.logger("Album File Loaded");
                albumName.Text = (string)CurrentAlbum["albumname"];
                Utilities.logger("albumname=:"+(string)CurrentAlbum["albumname"] +":");

                Pictures  = (JArray)CurrentAlbum["pictures"];  // get the array of picture objects
                NumPictures = Pictures.Count;
                Utilities.logger("NumPictures=:"+NumPictures +":");
                //Utilities.logger("Pictures[0] :"+((JObject)Pictures[0]).ToString() +":");
                //Utilities.logger("CurrentAlbum['pictures'] :"+((JObject)CurrentAlbum["pictures"][0]).ToString() +":");
                //Utilities.logger("notes for :"+(string)Pictures[0]["filename"]+": =:"+ (string)Pictures[0]["notes"] +":");

                // display picture in picker list
                foreach (JObject f in Pictures)
                {
                    string fname = (string)f[FILENAME];
                    this.listBox1.Items.Add(fname.Trim());
                }
                Utilities.logger("Pictures Loaded");
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
                foreach (string s in locations) whereTaken.Items.Add(s);
                foreach (string s in whens) whenTaken.Items.Add(s);

            }
            else   // no album files set up and make new one
            {
                Utilities.logger("No Album File");
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
                Utilities.logger("Found " + files.Count() + " pictures");

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
                    Utilities.logger("Added picture " + f.Name);
                } // foreach picture loading
                CurrentAlbum["pictures"] = Pictures;
            }
            Utilities.logger("albumLoader done");
            WebPageSetup.updateThumbnails(); // make thumbnails for each picture we found
            string albumFileName = saveTheAlbum();
            WebPageSetup.createWebPage(albumFileName); // copy web page files to the album folder
            showMessage("Album Loaded");
        } // albumLoader

        // action for loadAlbum button
        private void loadAlbum_Click(object sender, EventArgs e)
        {
            folderBrowserDialog1.RootFolder = Environment.SpecialFolder.MyComputer;
            folderBrowserDialog1.SelectedPath = @"C:\pictures";
            if (folderBrowserDialog1.ShowDialog() == DialogResult.OK) 
            {
               AlbumDirName = folderBrowserDialog1.SelectedPath;
               Utilities.logger("loadAlbum_Clicked: AlbumDirName=:" + AlbumDirName + ":");
               albumName.Text = Path.GetFileName(AlbumDirName);
               albumLoader(AlbumDirName);
               displayPicture(0);
            }
            Utilities.logger("loadAlbum_Click done");
        } // loadAlbum_Click

        private void notesBox_TextChanged(object sender, EventArgs e)
        {
            Utilities.logger("noteBox_TextChanged");
            noticeChange();
        } // notesBox_TextChanged

        private void caption_TextChanged(object sender, EventArgs e)
        {
            Utilities.logger("caption_TextChanged");
            noticeChange();
        } // caption_TextChanged

        private void whenTaken_TextChanged(object sender, EventArgs e)
        {
            Utilities.logger("whenTaken_TextChanged");
            noticeChange();
        } // whenTaken_TextChanged

        private void whereTaken_TextChanged(object sender, EventArgs e)
        {
            Utilities.logger("whereTaken_TextChanged");
            noticeChange();
        } // whereTaken_TextChanged

        private void whoBox_TextChanged(object sender, EventArgs e)
        {
            Utilities.logger("whoBox_TextChanged");
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
            Image<Bgr, Byte> bgrImage = new Image<Bgr, Byte>(imageFileName);
            //pictureBox.Image = bgrImage;

            CascadeClassifier _cascadeClassifier;
            _cascadeClassifier = new CascadeClassifier(Application.StartupPath + "/haarcascade_frontalface_alt_tree.xml");

            if (bgrImage != null) {
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
                using (var resizedImage = ScaleImage(bgrImage,pictureBox.Width, pictureBox.Height))
                {
                    if (pictureBox.Image != null) pictureBox.Image.Dispose();
                    pictureBox.Image = resizedImage;                    
                }
            }
            
            listBox1.SelectedIndex = listBox1.FindString(fname);

            // process and display the notes and other fields
            string notes = HttpUtility.UrlDecode((string)current[NOTES]);
            notesBox.Text = notes;
            //Utilities.logger("displayPicture: decoded notes=:"+HttpUtility.UrlDecode(notes)+":");
            Utilities.logger("\nnotes=:"+ notes+":");

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
        } // displayPicture

        // go back and forth through the Picture list
        private void nextButton_Click(object sender, EventArgs e)
        {
            saveChanges(); 
            if (PictureCounter == NumPictures - 1)
                PictureCounter = 0;
            else
                PictureCounter++;
            displayPicture(PictureCounter);
        } // nextButton_Click

        private void prevButton_Click(object sender, EventArgs e)
        {
            saveChanges(); 
            if (PictureCounter == 0)
                PictureCounter = NumPictures-1;
            else
                PictureCounter--;
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

        private void Form1_Load(object sender, EventArgs e)
        {
        }

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
            displayPicture(PictureCounter);
        } // listBox1_SelectedIndexChanged

        // generate the JSON data file for the album
        private String saveTheAlbum()
        {
            Utilities.logger("saving album");
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
        private void debugSwitch_Click(object sender, EventArgs e)
        {
            if (debugSwitch.Text.Contains("Off"))
            {
                Debug = true;
                debugSwitch.Text = debugSwitch.Text.Replace("Off", "On");
                debugSwitch.BackColor = Color.Red;
                debugForm.Show();
                //logLabel.Show();
                //logBox.Show();
            }
            else
            {
                Debug = false;
                debugSwitch.Text = debugSwitch.Text.Replace("On", "Off");
                debugSwitch.BackColor = Color.Lime;
                debugForm.Hide();
                //logLabel.Hide();
                //logBox.Hide();
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
            var ratioX = (double)maxWidth / image.Width;
            var ratioY = (double)maxHeight / image.Height;
            var ratio = Math.Min(ratioX, ratioY);

            var newWidth = (int)(image.Width * ratio);
            var newHeight = (int)(image.Height * ratio);

            var newImage = image.Resize(newWidth, newHeight, Inter.Linear);

            return newImage;
        } // ScaleImage

        private void panel3_Paint(object sender, PaintEventArgs e)
        {

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
    }// class PhotoAlbum
} // namespace PhotoAlbum