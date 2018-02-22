namespace PhotoAlbum
{
    partial class PhotoAlbum
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
            this.pictureBox1 = new System.Windows.Forms.PictureBox();
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.prevButton = new System.Windows.Forms.Button();
            this.nextButton = new System.Windows.Forms.Button();
            this.folderBrowserDialog1 = new System.Windows.Forms.FolderBrowserDialog();
            this.listBox1 = new System.Windows.Forms.ListBox();
            this.pictureBoxLabel = new System.Windows.Forms.Label();
            this.notesBox = new System.Windows.Forms.TextBox();
            this.loadAlbum = new System.Windows.Forms.Button();
            this.openFileDialog1 = new System.Windows.Forms.OpenFileDialog();
            this.saveFileDialog1 = new System.Windows.Forms.SaveFileDialog();
            this.saveAlbum = new System.Windows.Forms.Button();
            this.label3 = new System.Windows.Forms.Label();
            this.pictureFileName = new System.Windows.Forms.Label();
            this.label5 = new System.Windows.Forms.Label();
            this.caption = new System.Windows.Forms.TextBox();
            this.label6 = new System.Windows.Forms.Label();
            this.debugSwitch = new System.Windows.Forms.Button();
            this.timer1 = new System.Windows.Forms.Timer(this.components);
            this.message = new System.Windows.Forms.Label();
            this.albumName = new System.Windows.Forms.TextBox();
            this.panel2 = new System.Windows.Forms.Panel();
            this.panel3 = new System.Windows.Forms.Panel();
            this.pictureBox = new Emgu.CV.UI.ImageBox();
            this.panel4 = new System.Windows.Forms.Panel();
            this.whoBox = new System.Windows.Forms.TextBox();
            this.label8 = new System.Windows.Forms.Label();
            this.loadStatus = new System.Windows.Forms.Label();
            this.FormStatus = new System.Windows.Forms.Label();
            this.label4 = new System.Windows.Forms.Label();
            this.label7 = new System.Windows.Forms.Label();
            this.AlbumStatus = new System.Windows.Forms.Label();
            this.messages = new System.Windows.Forms.Label();
            this.whenTaken = new System.Windows.Forms.ComboBox();
            this.whereTaken = new System.Windows.Forms.ComboBox();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).BeginInit();
            this.panel2.SuspendLayout();
            this.panel3.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox)).BeginInit();
            this.panel4.SuspendLayout();
            this.SuspendLayout();
            // 
            // pictureBox1
            // 
            this.pictureBox1.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.pictureBox1.Location = new System.Drawing.Point(0, 63);
            this.pictureBox1.Margin = new System.Windows.Forms.Padding(4);
            this.pictureBox1.Name = "pictureBox1";
            this.pictureBox1.Size = new System.Drawing.Size(722, 366);
            this.pictureBox1.SizeMode = System.Windows.Forms.PictureBoxSizeMode.StretchImage;
            this.pictureBox1.TabIndex = 0;
            this.pictureBox1.TabStop = false;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(4, 25);
            this.label1.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(45, 17);
            this.label1.TabIndex = 4;
            this.label1.Text = "Notes";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(680, 7);
            this.label2.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(89, 17);
            this.label2.TabIndex = 5;
            this.label2.Text = "When Taken";
            // 
            // prevButton
            // 
            this.prevButton.Location = new System.Drawing.Point(0, 4);
            this.prevButton.Margin = new System.Windows.Forms.Padding(4);
            this.prevButton.Name = "prevButton";
            this.prevButton.Size = new System.Drawing.Size(100, 28);
            this.prevButton.TabIndex = 50;
            this.prevButton.TabStop = false;
            this.prevButton.Text = "Previous";
            this.prevButton.UseVisualStyleBackColor = true;
            this.prevButton.Click += new System.EventHandler(this.prevButton_Click);
            // 
            // nextButton
            // 
            this.nextButton.Location = new System.Drawing.Point(623, 7);
            this.nextButton.Margin = new System.Windows.Forms.Padding(4);
            this.nextButton.Name = "nextButton";
            this.nextButton.Size = new System.Drawing.Size(100, 28);
            this.nextButton.TabIndex = 5;
            this.nextButton.TabStop = false;
            this.nextButton.Text = "Next";
            this.nextButton.UseVisualStyleBackColor = true;
            this.nextButton.Click += new System.EventHandler(this.nextButton_Click);
            // 
            // folderBrowserDialog1
            // 
            this.folderBrowserDialog1.Description = "Pick a folder with pictures";
            this.folderBrowserDialog1.RootFolder = System.Environment.SpecialFolder.MyComputer;
            this.folderBrowserDialog1.ShowNewFolderButton = false;
            // 
            // listBox1
            // 
            this.listBox1.FormattingEnabled = true;
            this.listBox1.ItemHeight = 16;
            this.listBox1.Location = new System.Drawing.Point(0, 43);
            this.listBox1.Margin = new System.Windows.Forms.Padding(4);
            this.listBox1.Name = "listBox1";
            this.listBox1.Size = new System.Drawing.Size(232, 372);
            this.listBox1.TabIndex = 56;
            this.listBox1.TabStop = false;
            this.listBox1.SelectedIndexChanged += new System.EventHandler(this.listBox1_SelectedIndexChanged);
            // 
            // pictureBoxLabel
            // 
            this.pictureBoxLabel.AutoSize = true;
            this.pictureBoxLabel.Location = new System.Drawing.Point(197, 43);
            this.pictureBoxLabel.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.pictureBoxLabel.Name = "pictureBoxLabel";
            this.pictureBoxLabel.Size = new System.Drawing.Size(52, 17);
            this.pictureBoxLabel.TabIndex = 13;
            this.pictureBoxLabel.Text = "Picture";
            // 
            // notesBox
            // 
            this.notesBox.AcceptsReturn = true;
            this.notesBox.Location = new System.Drawing.Point(4, 44);
            this.notesBox.Margin = new System.Windows.Forms.Padding(4);
            this.notesBox.Multiline = true;
            this.notesBox.Name = "notesBox";
            this.notesBox.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.notesBox.Size = new System.Drawing.Size(341, 250);
            this.notesBox.TabIndex = 3;
            this.notesBox.Text = "NOTES";
            this.notesBox.TextChanged += new System.EventHandler(this.notesBox_TextChanged);
            // 
            // loadAlbum
            // 
            this.loadAlbum.Location = new System.Drawing.Point(5, 7);
            this.loadAlbum.Margin = new System.Windows.Forms.Padding(4);
            this.loadAlbum.Name = "loadAlbum";
            this.loadAlbum.Size = new System.Drawing.Size(100, 28);
            this.loadAlbum.TabIndex = 52;
            this.loadAlbum.TabStop = false;
            this.loadAlbum.Text = "Load Album";
            this.loadAlbum.UseVisualStyleBackColor = true;
            this.loadAlbum.Click += new System.EventHandler(this.loadAlbum_Click);
            // 
            // openFileDialog1
            // 
            this.openFileDialog1.FileName = "openFileDialog1";
            // 
            // saveAlbum
            // 
            this.saveAlbum.Location = new System.Drawing.Point(133, 7);
            this.saveAlbum.Margin = new System.Windows.Forms.Padding(4);
            this.saveAlbum.Name = "saveAlbum";
            this.saveAlbum.Size = new System.Drawing.Size(100, 28);
            this.saveAlbum.TabIndex = 51;
            this.saveAlbum.TabStop = false;
            this.saveAlbum.Text = "Save Album";
            this.saveAlbum.UseVisualStyleBackColor = true;
            this.saveAlbum.Click += new System.EventHandler(this.saveAlbum_Click);
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(17, 10);
            this.label3.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(88, 17);
            this.label3.TabIndex = 17;
            this.label3.Text = "Album Name";
            // 
            // pictureFileName
            // 
            this.pictureFileName.AutoSize = true;
            this.pictureFileName.Location = new System.Drawing.Point(259, 43);
            this.pictureFileName.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.pictureFileName.Name = "pictureFileName";
            this.pictureFileName.Size = new System.Drawing.Size(0, 17);
            this.pictureFileName.TabIndex = 19;
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(948, 10);
            this.label5.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(94, 17);
            this.label5.TabIndex = 22;
            this.label5.Text = "Where Taken";
            // 
            // caption
            // 
            this.caption.Location = new System.Drawing.Point(288, 7);
            this.caption.Margin = new System.Windows.Forms.Padding(4);
            this.caption.Name = "caption";
            this.caption.Size = new System.Drawing.Size(199, 22);
            this.caption.TabIndex = 2;
            this.caption.TextChanged += new System.EventHandler(this.caption_TextChanged);
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(221, 10);
            this.label6.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(56, 17);
            this.label6.TabIndex = 25;
            this.label6.Text = "Caption";
            // 
            // debugSwitch
            // 
            this.debugSwitch.BackColor = System.Drawing.Color.Lime;
            this.debugSwitch.Location = new System.Drawing.Point(328, 7);
            this.debugSwitch.Margin = new System.Windows.Forms.Padding(4);
            this.debugSwitch.Name = "debugSwitch";
            this.debugSwitch.Size = new System.Drawing.Size(100, 28);
            this.debugSwitch.TabIndex = 26;
            this.debugSwitch.TabStop = false;
            this.debugSwitch.Text = "Debug Off";
            this.debugSwitch.UseVisualStyleBackColor = false;
            this.debugSwitch.Click += new System.EventHandler(this.debugSwitch_Click);
            // 
            // message
            // 
            this.message.AutoSize = true;
            this.message.Location = new System.Drawing.Point(125, 7);
            this.message.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.message.Name = "message";
            this.message.Size = new System.Drawing.Size(46, 17);
            this.message.TabIndex = 27;
            this.message.Text = "label4";
            // 
            // albumName
            // 
            this.albumName.Location = new System.Drawing.Point(115, 7);
            this.albumName.Margin = new System.Windows.Forms.Padding(4);
            this.albumName.Name = "albumName";
            this.albumName.Size = new System.Drawing.Size(173, 22);
            this.albumName.TabIndex = 18;
            this.albumName.TabStop = false;
            // 
            // panel2
            // 
            this.panel2.AutoSize = true;
            this.panel2.Controls.Add(this.loadAlbum);
            this.panel2.Controls.Add(this.saveAlbum);
            this.panel2.Controls.Add(this.listBox1);
            this.panel2.Location = new System.Drawing.Point(16, 68);
            this.panel2.Margin = new System.Windows.Forms.Padding(4);
            this.panel2.Name = "panel2";
            this.panel2.Size = new System.Drawing.Size(237, 433);
            this.panel2.TabIndex = 29;
            // 
            // panel3
            // 
            this.panel3.Anchor = System.Windows.Forms.AnchorStyles.None;
            this.panel3.Controls.Add(this.pictureBox);
            this.panel3.Controls.Add(this.prevButton);
            this.panel3.Controls.Add(this.caption);
            this.panel3.Controls.Add(this.label6);
            this.panel3.Controls.Add(this.pictureBox1);
            this.panel3.Controls.Add(this.nextButton);
            this.panel3.Controls.Add(this.pictureBoxLabel);
            this.panel3.Controls.Add(this.pictureFileName);
            this.panel3.Location = new System.Drawing.Point(273, 68);
            this.panel3.Margin = new System.Windows.Forms.Padding(4);
            this.panel3.Name = "panel3";
            this.panel3.Size = new System.Drawing.Size(727, 433);
            this.panel3.TabIndex = 30;
            this.panel3.Paint += new System.Windows.Forms.PaintEventHandler(this.panel3_Paint);
            // 
            // pictureBox
            // 
            this.pictureBox.Location = new System.Drawing.Point(16, 82);
            this.pictureBox.Name = "pictureBox";
            this.pictureBox.Size = new System.Drawing.Size(681, 333);
            this.pictureBox.TabIndex = 2;
            this.pictureBox.TabStop = false;
            // 
            // panel4
            // 
            this.panel4.Anchor = System.Windows.Forms.AnchorStyles.None;
            this.panel4.AutoSizeMode = System.Windows.Forms.AutoSizeMode.GrowAndShrink;
            this.panel4.Controls.Add(this.whoBox);
            this.panel4.Controls.Add(this.label8);
            this.panel4.Controls.Add(this.label1);
            this.panel4.Controls.Add(this.message);
            this.panel4.Controls.Add(this.notesBox);
            this.panel4.Location = new System.Drawing.Point(1008, 68);
            this.panel4.Margin = new System.Windows.Forms.Padding(4);
            this.panel4.Name = "panel4";
            this.panel4.Size = new System.Drawing.Size(351, 433);
            this.panel4.TabIndex = 31;
            // 
            // whoBox
            // 
            this.whoBox.Location = new System.Drawing.Point(7, 344);
            this.whoBox.Multiline = true;
            this.whoBox.Name = "whoBox";
            this.whoBox.Size = new System.Drawing.Size(325, 85);
            this.whoBox.TabIndex = 4;
            this.whoBox.TextChanged += new System.EventHandler(this.whoBox_TextChanged);
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Location = new System.Drawing.Point(12, 324);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(37, 17);
            this.label8.TabIndex = 28;
            this.label8.Text = "Who";
            // 
            // loadStatus
            // 
            this.loadStatus.AutoEllipsis = true;
            this.loadStatus.AutoSize = true;
            this.loadStatus.Location = new System.Drawing.Point(18, 41);
            this.loadStatus.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.loadStatus.Name = "loadStatus";
            this.loadStatus.Size = new System.Drawing.Size(36, 17);
            this.loadStatus.TabIndex = 32;
            this.loadStatus.Text = "       ";
            // 
            // FormStatus
            // 
            this.FormStatus.AutoSize = true;
            this.FormStatus.BackColor = System.Drawing.Color.Lime;
            this.FormStatus.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.FormStatus.Location = new System.Drawing.Point(575, 1);
            this.FormStatus.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.FormStatus.Name = "FormStatus";
            this.FormStatus.Size = new System.Drawing.Size(69, 25);
            this.FormStatus.TabIndex = 33;
            this.FormStatus.Text = "Saved";
            this.FormStatus.Click += new System.EventHandler(this.savedStatus_Click);
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(459, 7);
            this.label4.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(84, 17);
            this.label4.TabIndex = 34;
            this.label4.Text = "Form Status";
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(459, 31);
            this.label7.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(91, 17);
            this.label7.TabIndex = 35;
            this.label7.Text = "Album Status";
            // 
            // AlbumStatus
            // 
            this.AlbumStatus.AutoSize = true;
            this.AlbumStatus.BackColor = System.Drawing.Color.Lime;
            this.AlbumStatus.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.AlbumStatus.Location = new System.Drawing.Point(575, 33);
            this.AlbumStatus.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.AlbumStatus.Name = "AlbumStatus";
            this.AlbumStatus.Size = new System.Drawing.Size(69, 25);
            this.AlbumStatus.TabIndex = 36;
            this.AlbumStatus.Text = "Saved";
            // 
            // messages
            // 
            this.messages.AutoSize = true;
            this.messages.Location = new System.Drawing.Point(270, 519);
            this.messages.Name = "messages";
            this.messages.Size = new System.Drawing.Size(24, 17);
            this.messages.TabIndex = 37;
            this.messages.Text = "    ";
            // 
            // whenTaken
            // 
            this.whenTaken.FormattingEnabled = true;
            this.whenTaken.Location = new System.Drawing.Point(683, 31);
            this.whenTaken.Name = "whenTaken";
            this.whenTaken.Size = new System.Drawing.Size(192, 24);
            this.whenTaken.TabIndex = 38;
            // 
            // whereTaken
            // 
            this.whereTaken.FormattingEnabled = true;
            this.whereTaken.Location = new System.Drawing.Point(951, 33);
            this.whereTaken.Name = "whereTaken";
            this.whereTaken.Size = new System.Drawing.Size(206, 24);
            this.whereTaken.TabIndex = 39;
            // 
            // PhotoAlbum
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.AutoSize = true;
            this.ClientSize = new System.Drawing.Size(1375, 559);
            this.Controls.Add(this.whereTaken);
            this.Controls.Add(this.whenTaken);
            this.Controls.Add(this.messages);
            this.Controls.Add(this.AlbumStatus);
            this.Controls.Add(this.label7);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.FormStatus);
            this.Controls.Add(this.loadStatus);
            this.Controls.Add(this.panel4);
            this.Controls.Add(this.panel2);
            this.Controls.Add(this.debugSwitch);
            this.Controls.Add(this.label5);
            this.Controls.Add(this.albumName);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.panel3);
            this.Margin = new System.Windows.Forms.Padding(4);
            this.Name = "PhotoAlbum";
            this.Text = "PhotoAlbum";
            this.Load += new System.EventHandler(this.Form1_Load);
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).EndInit();
            this.panel2.ResumeLayout(false);
            this.panel3.ResumeLayout(false);
            this.panel3.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox)).EndInit();
            this.panel4.ResumeLayout(false);
            this.panel4.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.PictureBox pictureBox1;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Button prevButton;
        private System.Windows.Forms.Button nextButton;
        private System.Windows.Forms.FolderBrowserDialog folderBrowserDialog1;
        private System.Windows.Forms.ListBox listBox1;
        private System.Windows.Forms.Label pictureBoxLabel;
        private System.Windows.Forms.TextBox notesBox;
        private System.Windows.Forms.Button loadAlbum;
        private System.Windows.Forms.OpenFileDialog openFileDialog1;
        private System.Windows.Forms.SaveFileDialog saveFileDialog1;
        private System.Windows.Forms.Button saveAlbum;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label pictureFileName;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.TextBox caption;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.Button debugSwitch;
        private System.Windows.Forms.Timer timer1;
        private System.Windows.Forms.Label message;
        private System.Windows.Forms.TextBox albumName;
        private System.Windows.Forms.Panel panel2;
        private System.Windows.Forms.Panel panel3;
        private System.Windows.Forms.Panel panel4;
        private System.Windows.Forms.Label FormStatus;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.Label AlbumStatus;
        public System.Windows.Forms.Label loadStatus;
        public System.Windows.Forms.Label messages;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.TextBox whoBox;
        private Emgu.CV.UI.ImageBox pictureBox;
        private System.Windows.Forms.ComboBox whenTaken;
        private System.Windows.Forms.ComboBox whereTaken;
    }
}

