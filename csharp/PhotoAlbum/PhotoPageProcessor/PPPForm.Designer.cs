namespace PhotoPageProcessor
{
    partial class PPPForm
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            this.loadAlbum = new System.Windows.Forms.Button();
            this.label3 = new System.Windows.Forms.Label();
            this.openFileDialog1 = new System.Windows.Forms.OpenFileDialog();
            this.folderBrowserDialog1 = new System.Windows.Forms.FolderBrowserDialog();
            this.saveFileDialog1 = new System.Windows.Forms.SaveFileDialog();
            this.albumName = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.showPicturePrefix = new System.Windows.Forms.Label();
            this.UserSettings = new System.Windows.Forms.Button();
            this.showPagePrefix = new System.Windows.Forms.Label();
            this.label4 = new System.Windows.Forms.Label();
            this.showOrigFolder = new System.Windows.Forms.Label();
            this.label5 = new System.Windows.Forms.Label();
            this.showBackOfPrefix = new System.Windows.Forms.Label();
            this.label7 = new System.Windows.Forms.Label();
            this.showDefaultPictures = new System.Windows.Forms.Label();
            this.label6 = new System.Windows.Forms.Label();
            this.toolTip1 = new System.Windows.Forms.ToolTip(this.components);
            this.pageList = new System.Windows.Forms.ListBox();
            this.saveClip = new System.Windows.Forms.Button();
            this.pageDone = new System.Windows.Forms.Button();
            this.label1 = new System.Windows.Forms.Label();
            this.pageFileName = new System.Windows.Forms.Label();
            this.backOfPageFile = new System.Windows.Forms.Label();
            this.label9 = new System.Windows.Forms.Label();
            this.pictureFileName = new System.Windows.Forms.Label();
            this.label10 = new System.Windows.Forms.Label();
            this.clippedImage = new System.Windows.Forms.PictureBox();
            this.panel2 = new System.Windows.Forms.Panel();
            this.rotateLeft = new System.Windows.Forms.Button();
            this.rotateRight = new System.Windows.Forms.Button();
            this.clipStatus = new System.Windows.Forms.Label();
            this.panel1 = new System.Windows.Forms.Panel();
            this.pageDisplay = new RickApps.CropImage.RubberBand();
            this.pageBackDisplay = new RickApps.CropImage.RubberBand();
            this.label8 = new System.Windows.Forms.Label();
            this.pixPerPage = new System.Windows.Forms.NumericUpDown();
            this.label11 = new System.Windows.Forms.Label();
            this.unsavedPictures = new System.Windows.Forms.Label();
            ((System.ComponentModel.ISupportInitialize)(this.clippedImage)).BeginInit();
            this.panel2.SuspendLayout();
            this.panel1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.pixPerPage)).BeginInit();
            this.SuspendLayout();
            // 
            // loadAlbum
            // 
            this.loadAlbum.Location = new System.Drawing.Point(13, 106);
            this.loadAlbum.Margin = new System.Windows.Forms.Padding(4);
            this.loadAlbum.Name = "loadAlbum";
            this.loadAlbum.Size = new System.Drawing.Size(100, 28);
            this.loadAlbum.TabIndex = 52;
            this.loadAlbum.TabStop = false;
            this.loadAlbum.Text = "Load Album";
            this.toolTip1.SetToolTip(this.loadAlbum, "Click here to search for a folder full of pictures");
            this.loadAlbum.UseVisualStyleBackColor = true;
            this.loadAlbum.Click += new System.EventHandler(this.loadAlbum_Click);
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Font = new System.Drawing.Font("Open Sans", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label3.Location = new System.Drawing.Point(13, 5);
            this.label3.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(143, 27);
            this.label3.TabIndex = 31;
            this.label3.Text = "Album Name";
            // 
            // openFileDialog1
            // 
            this.openFileDialog1.FileName = "openFileDialog1";
            // 
            // albumName
            // 
            this.albumName.BackColor = System.Drawing.Color.Coral;
            this.albumName.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.albumName.Location = new System.Drawing.Point(18, 32);
            this.albumName.Name = "albumName";
            this.albumName.Size = new System.Drawing.Size(261, 25);
            this.albumName.TabIndex = 32;
            this.albumName.Text = "Load Album First";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Font = new System.Drawing.Font("Open Sans", 10.2F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label2.Location = new System.Drawing.Point(313, 13);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(115, 23);
            this.label2.TabIndex = 33;
            this.label2.Text = "Picture Prefix";
            this.toolTip1.SetToolTip(this.label2, "Pictures clipped from a page will be saved in a file with this prefix. pict011.pn" +
        "g");
            // 
            // showPicturePrefix
            // 
            this.showPicturePrefix.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.showPicturePrefix.Location = new System.Drawing.Point(450, 15);
            this.showPicturePrefix.Name = "showPicturePrefix";
            this.showPicturePrefix.Size = new System.Drawing.Size(120, 19);
            this.showPicturePrefix.TabIndex = 34;
            // 
            // UserSettings
            // 
            this.UserSettings.Location = new System.Drawing.Point(1737, 7);
            this.UserSettings.Name = "UserSettings";
            this.UserSettings.Size = new System.Drawing.Size(75, 23);
            this.UserSettings.TabIndex = 35;
            this.UserSettings.Text = "Settings";
            this.UserSettings.UseVisualStyleBackColor = true;
            this.UserSettings.Click += new System.EventHandler(this.UserSettings_Click);
            // 
            // showPagePrefix
            // 
            this.showPagePrefix.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.showPagePrefix.Location = new System.Drawing.Point(689, 11);
            this.showPagePrefix.Name = "showPagePrefix";
            this.showPagePrefix.Size = new System.Drawing.Size(120, 23);
            this.showPagePrefix.TabIndex = 37;
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Font = new System.Drawing.Font("Open Sans", 10.2F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label4.Location = new System.Drawing.Point(576, 13);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(98, 23);
            this.label4.TabIndex = 36;
            this.label4.Text = "Page Prefix";
            this.toolTip1.SetToolTip(this.label4, "A page has several pictures in it, They are named with this.  page001.png");
            // 
            // showOrigFolder
            // 
            this.showOrigFolder.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.showOrigFolder.Location = new System.Drawing.Point(1556, 13);
            this.showOrigFolder.Name = "showOrigFolder";
            this.showOrigFolder.Size = new System.Drawing.Size(110, 21);
            this.showOrigFolder.TabIndex = 41;
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Font = new System.Drawing.Font("Open Sans", 10.2F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label5.Location = new System.Drawing.Point(1341, 9);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(179, 23);
            this.label5.TabIndex = 40;
            this.label5.Text = "Finished Pages Folder";
            this.toolTip1.SetToolTip(this.label5, "Once a page file is processed, it is moved to this folder");
            // 
            // showBackOfPrefix
            // 
            this.showBackOfPrefix.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.showBackOfPrefix.Location = new System.Drawing.Point(951, 16);
            this.showBackOfPrefix.Name = "showBackOfPrefix";
            this.showBackOfPrefix.Size = new System.Drawing.Size(120, 18);
            this.showBackOfPrefix.TabIndex = 39;
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Font = new System.Drawing.Font("Open Sans", 10.2F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label7.Location = new System.Drawing.Point(815, 11);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(120, 23);
            this.label7.TabIndex = 38;
            this.label7.Text = "Back Of Prefix";
            this.toolTip1.SetToolTip(this.label7, "The scans of the back of a page are named with this.  backOfpage001.png");
            // 
            // showDefaultPictures
            // 
            this.showDefaultPictures.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.showDefaultPictures.Location = new System.Drawing.Point(1225, 9);
            this.showDefaultPictures.Name = "showDefaultPictures";
            this.showDefaultPictures.Size = new System.Drawing.Size(110, 23);
            this.showDefaultPictures.TabIndex = 43;
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Font = new System.Drawing.Font("Open Sans", 10.2F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label6.Location = new System.Drawing.Point(1085, 10);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(121, 23);
            this.label6.TabIndex = 42;
            this.label6.Text = "Default Folder";
            this.toolTip1.SetToolTip(this.label6, "Where to start looking when you press Load Album");
            // 
            // pageList
            // 
            this.pageList.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.pageList.FormattingEnabled = true;
            this.pageList.ItemHeight = 16;
            this.pageList.Location = new System.Drawing.Point(6, 4);
            this.pageList.Margin = new System.Windows.Forms.Padding(4);
            this.pageList.Name = "pageList";
            this.pageList.Size = new System.Drawing.Size(148, 546);
            this.pageList.TabIndex = 56;
            this.pageList.TabStop = false;
            this.toolTip1.SetToolTip(this.pageList, "List of scanned pages to be processsed");
            this.pageList.SelectedIndexChanged += new System.EventHandler(this.listBox1_SelectedIndexChanged);
            // 
            // saveClip
            // 
            this.saveClip.Location = new System.Drawing.Point(1737, 93);
            this.saveClip.Name = "saveClip";
            this.saveClip.Size = new System.Drawing.Size(75, 47);
            this.saveClip.TabIndex = 67;
            this.saveClip.Text = "Save\r\nClip";
            this.toolTip1.SetToolTip(this.saveClip, "Save Clip to PNG file");
            this.saveClip.UseVisualStyleBackColor = true;
            this.saveClip.Click += new System.EventHandler(this.saveClip_Click);
            // 
            // pageDone
            // 
            this.pageDone.Location = new System.Drawing.Point(623, 92);
            this.pageDone.Name = "pageDone";
            this.pageDone.Size = new System.Drawing.Size(99, 47);
            this.pageDone.TabIndex = 64;
            this.pageDone.Tag = "";
            this.pageDone.Text = "Page\r\nDone";
            this.toolTip1.SetToolTip(this.pageDone, "Save selected image");
            this.pageDone.UseVisualStyleBackColor = true;
            this.pageDone.Click += new System.EventHandler(this.pageDone_Click);
            // 
            // label1
            // 
            this.label1.Location = new System.Drawing.Point(210, 98);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(109, 18);
            this.label1.TabIndex = 54;
            this.label1.Text = "Page File Name";
            // 
            // pageFileName
            // 
            this.pageFileName.Location = new System.Drawing.Point(192, 123);
            this.pageFileName.Name = "pageFileName";
            this.pageFileName.Size = new System.Drawing.Size(172, 17);
            this.pageFileName.TabIndex = 55;
            // 
            // backOfPageFile
            // 
            this.backOfPageFile.Location = new System.Drawing.Point(781, 119);
            this.backOfPageFile.Name = "backOfPageFile";
            this.backOfPageFile.Size = new System.Drawing.Size(157, 17);
            this.backOfPageFile.TabIndex = 58;
            // 
            // label9
            // 
            this.label9.AutoSize = true;
            this.label9.Location = new System.Drawing.Point(781, 99);
            this.label9.Name = "label9";
            this.label9.Size = new System.Drawing.Size(143, 17);
            this.label9.TabIndex = 57;
            this.label9.Text = "Page Back File Name";
            // 
            // pictureFileName
            // 
            this.pictureFileName.Location = new System.Drawing.Point(1310, 117);
            this.pictureFileName.Name = "pictureFileName";
            this.pictureFileName.Size = new System.Drawing.Size(160, 23);
            this.pictureFileName.TabIndex = 61;
            // 
            // label10
            // 
            this.label10.AutoSize = true;
            this.label10.Location = new System.Drawing.Point(1310, 97);
            this.label10.Name = "label10";
            this.label10.Size = new System.Drawing.Size(119, 17);
            this.label10.TabIndex = 60;
            this.label10.Text = "Picture File Name";
            // 
            // clippedImage
            // 
            this.clippedImage.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.clippedImage.Location = new System.Drawing.Point(1296, 142);
            this.clippedImage.Name = "clippedImage";
            this.clippedImage.Size = new System.Drawing.Size(516, 557);
            this.clippedImage.TabIndex = 59;
            this.clippedImage.TabStop = false;
            // 
            // panel2
            // 
            this.panel2.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.panel2.AutoSize = true;
            this.panel2.AutoSizeMode = System.Windows.Forms.AutoSizeMode.GrowAndShrink;
            this.panel2.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.panel2.Controls.Add(this.pageList);
            this.panel2.Location = new System.Drawing.Point(13, 137);
            this.panel2.Margin = new System.Windows.Forms.Padding(4);
            this.panel2.Name = "panel2";
            this.panel2.Size = new System.Drawing.Size(160, 556);
            this.panel2.TabIndex = 30;
            // 
            // rotateLeft
            // 
            this.rotateLeft.Location = new System.Drawing.Point(1529, 93);
            this.rotateLeft.Name = "rotateLeft";
            this.rotateLeft.Size = new System.Drawing.Size(75, 47);
            this.rotateLeft.TabIndex = 65;
            this.rotateLeft.Text = "Rotate\r\nLeft 90";
            this.rotateLeft.UseVisualStyleBackColor = true;
            this.rotateLeft.Click += new System.EventHandler(this.rotateLeft_Click);
            // 
            // rotateRight
            // 
            this.rotateRight.Location = new System.Drawing.Point(1610, 93);
            this.rotateRight.Name = "rotateRight";
            this.rotateRight.Size = new System.Drawing.Size(75, 47);
            this.rotateRight.TabIndex = 66;
            this.rotateRight.Text = "Rotate\r\nRight 90";
            this.rotateRight.UseVisualStyleBackColor = true;
            this.rotateRight.Click += new System.EventHandler(this.rotateRight_Click);
            // 
            // clipStatus
            // 
            this.clipStatus.AutoSize = true;
            this.clipStatus.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.clipStatus.Location = new System.Drawing.Point(1313, 47);
            this.clipStatus.Name = "clipStatus";
            this.clipStatus.Size = new System.Drawing.Size(2, 19);
            this.clipStatus.TabIndex = 68;
            // 
            // panel1
            // 
            this.panel1.AutoScroll = true;
            this.panel1.Controls.Add(this.pageDisplay);
            this.panel1.Location = new System.Drawing.Point(189, 142);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(557, 557);
            this.panel1.TabIndex = 69;
            // 
            // pageDisplay
            // 
            this.pageDisplay.Disabled = false;
            this.pageDisplay.Image = null;
            this.pageDisplay.Location = new System.Drawing.Point(13, 17);
            this.pageDisplay.Margin = new System.Windows.Forms.Padding(4);
            this.pageDisplay.Name = "pageDisplay";
            this.pageDisplay.Size = new System.Drawing.Size(530, 513);
            this.pageDisplay.SizeMode = System.Windows.Forms.PictureBoxSizeMode.AutoSize;
            this.pageDisplay.TabIndex = 0;
            this.pageDisplay.ImageCropped += new System.EventHandler(this.OnImageCropped);
            // 
            // pageBackDisplay
            // 
            this.pageBackDisplay.Disabled = false;
            this.pageBackDisplay.Image = null;
            this.pageBackDisplay.Location = new System.Drawing.Point(763, 140);
            this.pageBackDisplay.Margin = new System.Windows.Forms.Padding(4);
            this.pageBackDisplay.Name = "pageBackDisplay";
            this.pageBackDisplay.Size = new System.Drawing.Size(517, 551);
            this.pageBackDisplay.SizeMode = System.Windows.Forms.PictureBoxSizeMode.AutoSize;
            this.pageBackDisplay.TabIndex = 70;
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Location = new System.Drawing.Point(414, 123);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(111, 17);
            this.label8.TabIndex = 71;
            this.label8.Text = "Pictures In Page";
            // 
            // pixPerPage
            // 
            this.pixPerPage.Location = new System.Drawing.Point(531, 117);
            this.pixPerPage.Name = "pixPerPage";
            this.pixPerPage.Size = new System.Drawing.Size(76, 22);
            this.pixPerPage.TabIndex = 72;
            this.pixPerPage.Value = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.pixPerPage.ValueChanged += new System.EventHandler(this.pixPerPage_ValueChanged);
            // 
            // label11
            // 
            this.label11.AutoSize = true;
            this.label11.Location = new System.Drawing.Point(1658, 56);
            this.label11.Name = "label11";
            this.label11.Size = new System.Drawing.Size(91, 34);
            this.label11.TabIndex = 73;
            this.label11.Text = "Unsaved\r\n Pictures Left";
            // 
            // unsavedPictures
            // 
            this.unsavedPictures.AutoSize = true;
            this.unsavedPictures.Location = new System.Drawing.Point(1755, 56);
            this.unsavedPictures.Name = "unsavedPictures";
            this.unsavedPictures.Size = new System.Drawing.Size(16, 17);
            this.unsavedPictures.TabIndex = 74;
            this.unsavedPictures.Text = "0";
            // 
            // PPPForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1824, 789);
            this.Controls.Add(this.unsavedPictures);
            this.Controls.Add(this.label11);
            this.Controls.Add(this.pixPerPage);
            this.Controls.Add(this.label8);
            this.Controls.Add(this.pageBackDisplay);
            this.Controls.Add(this.panel1);
            this.Controls.Add(this.clipStatus);
            this.Controls.Add(this.saveClip);
            this.Controls.Add(this.rotateRight);
            this.Controls.Add(this.rotateLeft);
            this.Controls.Add(this.pageDone);
            this.Controls.Add(this.pictureFileName);
            this.Controls.Add(this.label10);
            this.Controls.Add(this.clippedImage);
            this.Controls.Add(this.backOfPageFile);
            this.Controls.Add(this.label9);
            this.Controls.Add(this.pageFileName);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.loadAlbum);
            this.Controls.Add(this.showDefaultPictures);
            this.Controls.Add(this.label6);
            this.Controls.Add(this.showOrigFolder);
            this.Controls.Add(this.label5);
            this.Controls.Add(this.showBackOfPrefix);
            this.Controls.Add(this.label7);
            this.Controls.Add(this.showPagePrefix);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.UserSettings);
            this.Controls.Add(this.showPicturePrefix);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.albumName);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.panel2);
            this.Name = "PPPForm";
            this.Text = "PhotoPageProcessor";
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.PPPForm_FormClosing);
            this.Load += new System.EventHandler(this.PPPForm_Load);
            ((System.ComponentModel.ISupportInitialize)(this.clippedImage)).EndInit();
            this.panel2.ResumeLayout(false);
            this.panel1.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.pixPerPage)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion
        private System.Windows.Forms.Button loadAlbum;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.OpenFileDialog openFileDialog1;
        private System.Windows.Forms.FolderBrowserDialog folderBrowserDialog1;
        private System.Windows.Forms.SaveFileDialog saveFileDialog1;
        private System.Windows.Forms.Label albumName;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label showPicturePrefix;
        private System.Windows.Forms.Button UserSettings;
        private System.Windows.Forms.Label showPagePrefix;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Label showOrigFolder;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.Label showBackOfPrefix;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.Label showDefaultPictures;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.ToolTip toolTip1;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label pageFileName;
        private System.Windows.Forms.Label backOfPageFile;
        private System.Windows.Forms.Label label9;
        private System.Windows.Forms.Label pictureFileName;
        private System.Windows.Forms.Label label10;
        private System.Windows.Forms.PictureBox clippedImage;
        private System.Windows.Forms.ListBox pageList;
        private System.Windows.Forms.Panel panel2;
        private System.Windows.Forms.Button rotateLeft;
        private System.Windows.Forms.Button rotateRight;
        private System.Windows.Forms.Button saveClip;
        private System.Windows.Forms.Label clipStatus;
        private System.Windows.Forms.Panel panel1;
        private RickApps.CropImage.RubberBand pageDisplay;
        private System.Windows.Forms.Button pageDone;
        private RickApps.CropImage.RubberBand pageBackDisplay;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.NumericUpDown pixPerPage;
        private System.Windows.Forms.Label label11;
        private System.Windows.Forms.Label unsavedPictures;
    }
}

