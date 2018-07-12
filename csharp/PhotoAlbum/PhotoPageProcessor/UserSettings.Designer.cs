namespace PhotoPageProcessor
{
    partial class UserSettings
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
            this.label1 = new System.Windows.Forms.Label();
            this.PicturePrefix = new System.Windows.Forms.TextBox();
            this.PagePrefix = new System.Windows.Forms.TextBox();
            this.label2 = new System.Windows.Forms.Label();
            this.BackOfPrefix = new System.Windows.Forms.TextBox();
            this.label3 = new System.Windows.Forms.Label();
            this.SaveSettings = new System.Windows.Forms.Button();
            this.CancelSettings = new System.Windows.Forms.Button();
            this.OrigFolder = new System.Windows.Forms.TextBox();
            this.label4 = new System.Windows.Forms.Label();
            this.DefaultPictures = new System.Windows.Forms.TextBox();
            this.label5 = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(12, 17);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(91, 17);
            this.label1.TabIndex = 5;
            this.label1.Text = "Picture Prefix";
            // 
            // PicturePrefix
            // 
            this.PicturePrefix.Location = new System.Drawing.Point(194, 17);
            this.PicturePrefix.Name = "PicturePrefix";
            this.PicturePrefix.Size = new System.Drawing.Size(154, 22);
            this.PicturePrefix.TabIndex = 6;
            // 
            // PagePrefix
            // 
            this.PagePrefix.Location = new System.Drawing.Point(194, 54);
            this.PagePrefix.Name = "PagePrefix";
            this.PagePrefix.Size = new System.Drawing.Size(154, 22);
            this.PagePrefix.TabIndex = 8;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(12, 54);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(80, 17);
            this.label2.TabIndex = 7;
            this.label2.Text = "Page Prefix";
            // 
            // BackOfPrefix
            // 
            this.BackOfPrefix.Location = new System.Drawing.Point(194, 89);
            this.BackOfPrefix.Name = "BackOfPrefix";
            this.BackOfPrefix.Size = new System.Drawing.Size(154, 22);
            this.BackOfPrefix.TabIndex = 10;
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(12, 94);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(134, 17);
            this.label3.TabIndex = 9;
            this.label3.Text = "Back Of Page Prefix";
            // 
            // SaveSettings
            // 
            this.SaveSettings.Location = new System.Drawing.Point(12, 214);
            this.SaveSettings.Name = "SaveSettings";
            this.SaveSettings.Size = new System.Drawing.Size(119, 23);
            this.SaveSettings.TabIndex = 11;
            this.SaveSettings.Text = "Save Settings";
            this.SaveSettings.UseVisualStyleBackColor = true;
            this.SaveSettings.Click += new System.EventHandler(this.SaveSettings_Click);
            // 
            // CancelSettings
            // 
            this.CancelSettings.Location = new System.Drawing.Point(273, 214);
            this.CancelSettings.Name = "CancelSettings";
            this.CancelSettings.Size = new System.Drawing.Size(75, 23);
            this.CancelSettings.TabIndex = 12;
            this.CancelSettings.Text = "Cancel";
            this.CancelSettings.UseVisualStyleBackColor = true;
            this.CancelSettings.Click += new System.EventHandler(this.CancelSettings_Click);
            // 
            // OrigFolder
            // 
            this.OrigFolder.Location = new System.Drawing.Point(194, 124);
            this.OrigFolder.Name = "OrigFolder";
            this.OrigFolder.Size = new System.Drawing.Size(154, 22);
            this.OrigFolder.TabIndex = 14;
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(12, 129);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(174, 17);
            this.label4.TabIndex = 13;
            this.label4.Text = "Folder For Finished Pages";
            // 
            // DefaultPictures
            // 
            this.DefaultPictures.Location = new System.Drawing.Point(194, 164);
            this.DefaultPictures.Name = "DefaultPictures";
            this.DefaultPictures.Size = new System.Drawing.Size(154, 22);
            this.DefaultPictures.TabIndex = 16;
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(12, 169);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(181, 17);
            this.label5.TabIndex = 15;
            this.label5.Text = "Starting Folder For Pictures";
            // 
            // UserSettings
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(372, 260);
            this.Controls.Add(this.DefaultPictures);
            this.Controls.Add(this.label5);
            this.Controls.Add(this.OrigFolder);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.CancelSettings);
            this.Controls.Add(this.SaveSettings);
            this.Controls.Add(this.BackOfPrefix);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.PagePrefix);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.PicturePrefix);
            this.Controls.Add(this.label1);
            this.Name = "UserSettings";
            this.Text = "UserSettings";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.TextBox PicturePrefix;
        private System.Windows.Forms.TextBox PagePrefix;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.TextBox BackOfPrefix;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Button SaveSettings;
        private System.Windows.Forms.Button CancelSettings;
        private System.Windows.Forms.TextBox OrigFolder;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.TextBox DefaultPictures;
        private System.Windows.Forms.Label label5;
    }
}