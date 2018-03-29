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
            this.pageDisplay = new System.Windows.Forms.PictureBox();
            this.label1 = new System.Windows.Forms.Label();
            this.pageFileName = new System.Windows.Forms.Label();
            this.backOfPageFile = new System.Windows.Forms.Label();
            this.label9 = new System.Windows.Forms.Label();
            this.pageBackDisplay = new System.Windows.Forms.PictureBox();
            this.pictureFileName = new System.Windows.Forms.Label();
            this.label10 = new System.Windows.Forms.Label();
            this.pictureBox2 = new System.Windows.Forms.PictureBox();
            this.rotatePage = new System.Windows.Forms.Button();
            this.pageList = new System.Windows.Forms.ListBox();
            this.panel2 = new System.Windows.Forms.Panel();
            ((System.ComponentModel.ISupportInitialize)(this.pageDisplay)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.pageBackDisplay)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox2)).BeginInit();
            this.panel2.SuspendLayout();
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
            this.label3.Location = new System.Drawing.Point(25, 15);
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
            this.albumName.Location = new System.Drawing.Point(175, 17);
            this.albumName.Name = "albumName";
            this.albumName.Size = new System.Drawing.Size(116, 19);
            this.albumName.TabIndex = 32;
            this.albumName.Text = "Load Album First";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Font = new System.Drawing.Font("Open Sans", 10.2F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label2.Location = new System.Drawing.Point(369, 17);
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
            this.showPicturePrefix.Location = new System.Drawing.Point(505, 19);
            this.showPicturePrefix.Name = "showPicturePrefix";
            this.showPicturePrefix.Size = new System.Drawing.Size(120, 19);
            this.showPicturePrefix.TabIndex = 34;
            // 
            // UserSettings
            // 
            this.UserSettings.Location = new System.Drawing.Point(1407, 12);
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
            this.showPagePrefix.Location = new System.Drawing.Point(505, 40);
            this.showPagePrefix.Name = "showPagePrefix";
            this.showPagePrefix.Size = new System.Drawing.Size(120, 23);
            this.showPagePrefix.TabIndex = 37;
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Font = new System.Drawing.Font("Open Sans", 10.2F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label4.Location = new System.Drawing.Point(369, 40);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(98, 23);
            this.label4.TabIndex = 36;
            this.label4.Text = "Page Prefix";
            this.toolTip1.SetToolTip(this.label4, "A page has several pictures in it, They are named with this.  page001.png");
            // 
            // showOrigFolder
            // 
            this.showOrigFolder.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.showOrigFolder.Location = new System.Drawing.Point(241, 81);
            this.showOrigFolder.Name = "showOrigFolder";
            this.showOrigFolder.Size = new System.Drawing.Size(110, 21);
            this.showOrigFolder.TabIndex = 41;
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Font = new System.Drawing.Font("Open Sans", 10.2F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label5.Location = new System.Drawing.Point(26, 77);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(179, 23);
            this.label5.TabIndex = 40;
            this.label5.Text = "Finished Pages Folder";
            this.toolTip1.SetToolTip(this.label5, "Once a page file is processed, it is moved to this folder");
            // 
            // showBackOfPrefix
            // 
            this.showBackOfPrefix.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.showBackOfPrefix.Location = new System.Drawing.Point(505, 68);
            this.showBackOfPrefix.Name = "showBackOfPrefix";
            this.showBackOfPrefix.Size = new System.Drawing.Size(120, 18);
            this.showBackOfPrefix.TabIndex = 39;
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Font = new System.Drawing.Font("Open Sans", 10.2F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label7.Location = new System.Drawing.Point(369, 63);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(120, 23);
            this.label7.TabIndex = 38;
            this.label7.Text = "Back Of Prefix";
            this.toolTip1.SetToolTip(this.label7, "The scans of the back of a page are named with this.  backOfpage001.png");
            // 
            // showDefaultPictures
            // 
            this.showDefaultPictures.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.showDefaultPictures.Location = new System.Drawing.Point(241, 57);
            this.showDefaultPictures.Name = "showDefaultPictures";
            this.showDefaultPictures.Size = new System.Drawing.Size(110, 23);
            this.showDefaultPictures.TabIndex = 43;
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Font = new System.Drawing.Font("Open Sans", 10.2F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label6.Location = new System.Drawing.Point(25, 51);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(121, 23);
            this.label6.TabIndex = 42;
            this.label6.Text = "Default Folder";
            this.toolTip1.SetToolTip(this.label6, "Where to start looking when you press Load Album");
            // 
            // pageDisplay
            // 
            this.pageDisplay.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.pageDisplay.Location = new System.Drawing.Point(213, 134);
            this.pageDisplay.Name = "pageDisplay";
            this.pageDisplay.Size = new System.Drawing.Size(561, 560);
            this.pageDisplay.TabIndex = 53;
            this.pageDisplay.TabStop = false;
            // 
            // label1
            // 
            this.label1.Location = new System.Drawing.Point(260, 108);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(109, 18);
            this.label1.TabIndex = 54;
            this.label1.Text = "Page File Name";
            // 
            // pageFileName
            // 
            this.pageFileName.Location = new System.Drawing.Point(389, 108);
            this.pageFileName.Name = "pageFileName";
            this.pageFileName.Size = new System.Drawing.Size(153, 17);
            this.pageFileName.TabIndex = 55;
            // 
            // backOfPageFile
            // 
            this.backOfPageFile.Location = new System.Drawing.Point(934, 117);
            this.backOfPageFile.Name = "backOfPageFile";
            this.backOfPageFile.Size = new System.Drawing.Size(157, 17);
            this.backOfPageFile.TabIndex = 58;
            // 
            // label9
            // 
            this.label9.AutoSize = true;
            this.label9.Location = new System.Drawing.Point(780, 117);
            this.label9.Name = "label9";
            this.label9.Size = new System.Drawing.Size(143, 17);
            this.label9.TabIndex = 57;
            this.label9.Text = "Page Back File Name";
            // 
            // pageBackDisplay
            // 
            this.pageBackDisplay.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.pageBackDisplay.Location = new System.Drawing.Point(783, 137);
            this.pageBackDisplay.Name = "pageBackDisplay";
            this.pageBackDisplay.Size = new System.Drawing.Size(519, 557);
            this.pageBackDisplay.TabIndex = 56;
            this.pageBackDisplay.TabStop = false;
            // 
            // pictureFileName
            // 
            this.pictureFileName.Location = new System.Drawing.Point(1444, 116);
            this.pictureFileName.Name = "pictureFileName";
            this.pictureFileName.Size = new System.Drawing.Size(279, 23);
            this.pictureFileName.TabIndex = 61;
            // 
            // label10
            // 
            this.label10.AutoSize = true;
            this.label10.Location = new System.Drawing.Point(1308, 120);
            this.label10.Name = "label10";
            this.label10.Size = new System.Drawing.Size(119, 17);
            this.label10.TabIndex = 60;
            this.label10.Text = "Picture File Name";
            // 
            // pictureBox2
            // 
            this.pictureBox2.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.pictureBox2.Location = new System.Drawing.Point(1313, 142);
            this.pictureBox2.Name = "pictureBox2";
            this.pictureBox2.Size = new System.Drawing.Size(499, 377);
            this.pictureBox2.TabIndex = 59;
            this.pictureBox2.TabStop = false;
            // 
            // rotatePage
            // 
            this.rotatePage.Location = new System.Drawing.Point(538, 108);
            this.rotatePage.Name = "rotatePage";
            this.rotatePage.Size = new System.Drawing.Size(99, 23);
            this.rotatePage.TabIndex = 62;
            this.rotatePage.Tag = "";
            this.rotatePage.Text = "Rotate Page";
            this.rotatePage.UseVisualStyleBackColor = true;
            this.rotatePage.Click += new System.EventHandler(this.rotatePage_Click);
            // 
            // pageList
            // 
            this.pageList.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.pageList.FormattingEnabled = true;
            this.pageList.ItemHeight = 16;
            this.pageList.Location = new System.Drawing.Point(6, 4);
            this.pageList.Margin = new System.Windows.Forms.Padding(4);
            this.pageList.Name = "pageList";
            this.pageList.Size = new System.Drawing.Size(148, 530);
            this.pageList.TabIndex = 56;
            this.pageList.TabStop = false;
            this.toolTip1.SetToolTip(this.pageList, "List of scanned pages to be processsed");
            this.pageList.SelectedIndexChanged += new System.EventHandler(this.listBox1_SelectedIndexChanged);
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
            this.panel2.Size = new System.Drawing.Size(160, 540);
            this.panel2.TabIndex = 30;
            // 
            // PPPForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1824, 789);
            this.Controls.Add(this.rotatePage);
            this.Controls.Add(this.pictureFileName);
            this.Controls.Add(this.label10);
            this.Controls.Add(this.pictureBox2);
            this.Controls.Add(this.backOfPageFile);
            this.Controls.Add(this.label9);
            this.Controls.Add(this.pageBackDisplay);
            this.Controls.Add(this.pageFileName);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.pageDisplay);
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
            ((System.ComponentModel.ISupportInitialize)(this.pageDisplay)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.pageBackDisplay)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox2)).EndInit();
            this.panel2.ResumeLayout(false);
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
        private System.Windows.Forms.PictureBox pageDisplay;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label pageFileName;
        private System.Windows.Forms.Label backOfPageFile;
        private System.Windows.Forms.Label label9;
        private System.Windows.Forms.PictureBox pageBackDisplay;
        private System.Windows.Forms.Label pictureFileName;
        private System.Windows.Forms.Label label10;
        private System.Windows.Forms.PictureBox pictureBox2;
        private System.Windows.Forms.Button rotatePage;
        private System.Windows.Forms.ListBox pageList;
        private System.Windows.Forms.Panel panel2;
    }
}

