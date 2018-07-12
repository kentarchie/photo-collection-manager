using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.IO;
using Newtonsoft.Json.Linq;

namespace PhotoAlbum
{
    public class WebPageSetup
    {
        private const int THUMB_NAIL_WIDTH = 300;
        private const String ALBUM_FILE_NAME = "ALBUMFILENAME";

        public static void updateThumbnails()
        {
            Image fileImage = null;
            Utilities.logger("updateThumbnails: start");
            string thumbNailsPath = Path.Combine(PhotoAlbum.AlbumDirName, "thumbnails");
            if (!Directory.Exists(thumbNailsPath)) {
                Directory.CreateDirectory(thumbNailsPath);
            }
            Utilities.logger("updateThumbNails: thumbnails directory done");

            int numPictures = PhotoAlbum.Pictures.Count;
            Utilities.logger("updateThumbNails: numPictures=:" + numPictures + ":");
            int curPicture = 1;
            foreach (JObject pic in PhotoAlbum.Pictures) {
                string fname = (string)pic["filename"];
                string fpathString = Path.Combine(PhotoAlbum.AlbumDirName, fname);
                string thumbPath = Path.Combine(thumbNailsPath, fname);
                //Utilities.logger("updateThumbNails: thumbPath=:" + thumbPath + ":");
                if (!File.Exists(thumbPath)) {
                    curPicture++;
                    if (curPicture % 10 == 0)
                        Utilities.logger(String.Format("updateThumbNails: working on count={0} fname=:{1}", curPicture, fpathString));
                    try {
                        fileImage = Image.FromFile(fpathString);
                        using ( Image thumb = ResizeImageFixedWidth(fileImage, THUMB_NAIL_WIDTH ) ) {
                            thumb.Save(thumbPath);
                        }
                        fileImage.Dispose();
                        PhotoAlbum.mainForm.loadStatus.Text = String.Format("Loaded Picture {0}/{1}", curPicture, numPictures);
                        PhotoAlbum.mainForm.loadStatus.Refresh();
                    }
                    catch (Exception ex)
                    {
                        Utilities.logger("updateThumbnails: Exception: " + ex.ToString());
                        PhotoAlbum.mainForm.messages.Text = String.Format("{0}", ex);
                        PhotoAlbum.mainForm.messages.Refresh();
                    }
                }
            } // for each picture
            Utilities.logger("updateThumbnails: done");
        } // updateThumbnails

        // from http://stackoverflow.com/questions/8214562/resize-jpeg-image-to-fixed-width-while-keeping-aspect-ratio-as-it-is
        public static Image ResizeImageFixedWidth(Image imgToResize, int width)
        {
            int sourceWidth = imgToResize.Width;
            int sourceHeight = imgToResize.Height;

            float nPercent = ((float)width / (float)sourceWidth);

            int destWidth = (int)(sourceWidth * nPercent);
            int destHeight = (int)(sourceHeight * nPercent);

            Bitmap b = new Bitmap(destWidth, destHeight);
            Graphics g = Graphics.FromImage((Image)b);
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;

            g.DrawImage(imgToResize, 0, 0, destWidth, destHeight);
            g.Dispose();

            return (Image)b;
        }

        // most of this from
        // http://stackoverflow.com/questions/627504/what-is-the-best-way-to-recursively-copy-contents-in-c/627518#627518
        private static void CopyAll(DirectoryInfo sourceInfo, DirectoryInfo targetInfo)
        {
            try
                {
                    //check if the target directory exists
                    if (Directory.Exists(targetInfo.FullName) == false) {
                        Directory.CreateDirectory(targetInfo.FullName);
                    }
    
                    //copy all the files into the new directory
                    foreach (FileInfo fi in sourceInfo.GetFiles()) {
                        fi.CopyTo(Path.Combine(targetInfo.ToString(), fi.Name), true);
                    }
    
                    //copy all the sub directories using recursion
                    foreach (DirectoryInfo diSourceDir in sourceInfo.GetDirectories()) {
                        DirectoryInfo nextTargetDir = targetInfo.CreateSubdirectory(diSourceDir.Name);
                        CopyAll(diSourceDir, nextTargetDir);
                    }
                }
                catch (IOException ie)
                {
                    Utilities.logger( String.Format("CopyAll: Failed exception=:{0}:",ie));
                    PhotoAlbum.mainForm.messages.Text = String.Format("CopyAll: {0}", ie);
                    PhotoAlbum.mainForm.messages.Refresh();
                }
        } // CopyAll

        // copy the web page template from the source to the current directory
        public static void createWebPage(String albumFileName)
        {
            // where are we running this program?
            var webPageSourceDirectory = System.Reflection.Assembly.GetExecutingAssembly().CodeBase;
            Utilities.logger("createWebPage: webPageSourceDirectory=:" + webPageSourceDirectory);
            // where is the template web page code and files?
            string sourcePath = Path.Combine(Path.GetDirectoryName(webPageSourceDirectory).Replace("file:\\",""), "webpage");
            
            // where should we copy the template web page to?
            string targetPath = Path.Combine(PhotoAlbum.AlbumDirName, "webpage");
            Utilities.logger( String.Format("createWebPage: targetPath=:{0}: sourcePath=:{1}:",targetPath,sourcePath));

            DirectoryInfo sourceInfo = new DirectoryInfo(sourcePath);
            DirectoryInfo targetInfo = new DirectoryInfo(targetPath);
            if (!Directory.Exists(targetPath)) {
                Directory.CreateDirectory(targetPath);
            }
            CopyAll(sourceInfo, targetInfo); // directory copy
            ReCopyIndexFile(sourceInfo, targetInfo,albumFileName);
        } // createWebPage

        // update the index.html file to replace the template values
        private static void ReCopyIndexFile(DirectoryInfo sourceInfo, DirectoryInfo targetInfo, String albumFileName)
        {
            // check for webpage directory
            if (!Directory.Exists(targetInfo.FullName)) {
                Utilities.logger( String.Format("ReCopyIndexFile: Failed target directory missing: {0}",targetInfo.FullName));
                PhotoAlbum.mainForm.messages.Text = String.Format("ReCopyIndexFile: {0}", targetInfo.FullName);
                PhotoAlbum.mainForm.messages.Refresh();
                return;
            }
            string indexFilePath = Path.Combine(targetInfo.FullName, "index.html");
            Utilities.logger( String.Format("ReCopyIndexFile: indexFilePath :{0}: ",indexFilePath));
            
            string[] lines = File.ReadAllLines(indexFilePath);
            Utilities.logger( String.Format("ReCopyIndexFile: input lines length :{0}: ",lines.Length));
            //var processed = lines.Select(line => string.Format("{0}", line.Replace(ALBUM_FILE_NAME , albumFileName)));
            for (int i=0; i< lines.Length; ++i) {
                if(lines[i].Contains(ALBUM_FILE_NAME)) Utilities.logger("ReCopyIndexFile: found file name");
                lines[i] = lines[i].Replace(ALBUM_FILE_NAME, albumFileName);
            }
            File.WriteAllLines(indexFilePath, lines);
        } // ReCopyIndexFile
    } // WebPageSetup
} // namespace PhotoAlbum