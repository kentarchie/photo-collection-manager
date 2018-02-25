namespace PhotoAlbum
{
    partial class VagueDate
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
            this.dateTimePicker1 = new System.Windows.Forms.DateTimePicker();
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.seasons = new System.Windows.Forms.GroupBox();
            this.WinterSeason = new System.Windows.Forms.RadioButton();
            this.SpringSeason = new System.Windows.Forms.RadioButton();
            this.SummerSeason = new System.Windows.Forms.RadioButton();
            this.FallSeason = new System.Windows.Forms.RadioButton();
            this.YearLabel = new System.Windows.Forms.Label();
            this.YearValue = new System.Windows.Forms.TextBox();
            this.button1 = new System.Windows.Forms.Button();
            this.button2 = new System.Windows.Forms.Button();
            this.seasons.SuspendLayout();
            this.SuspendLayout();
            // 
            // dateTimePicker1
            // 
            this.dateTimePicker1.Location = new System.Drawing.Point(12, 29);
            this.dateTimePicker1.Name = "dateTimePicker1";
            this.dateTimePicker1.Size = new System.Drawing.Size(182, 22);
            this.dateTimePicker1.TabIndex = 0;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(57, 9);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(91, 17);
            this.label1.TabIndex = 1;
            this.label1.Text = "Specific Date";
            this.label1.Click += new System.EventHandler(this.label1_Click);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(238, 29);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(56, 17);
            this.label2.TabIndex = 2;
            this.label2.Text = "Season";
            // 
            // seasons
            // 
            this.seasons.Controls.Add(this.FallSeason);
            this.seasons.Controls.Add(this.SummerSeason);
            this.seasons.Controls.Add(this.SpringSeason);
            this.seasons.Controls.Add(this.WinterSeason);
            this.seasons.Location = new System.Drawing.Point(235, 55);
            this.seasons.Name = "seasons";
            this.seasons.Size = new System.Drawing.Size(82, 115);
            this.seasons.TabIndex = 3;
            this.seasons.TabStop = false;
            // 
            // WinterSeason
            // 
            this.WinterSeason.AutoSize = true;
            this.WinterSeason.Location = new System.Drawing.Point(0, 0);
            this.WinterSeason.Name = "WinterSeason";
            this.WinterSeason.Size = new System.Drawing.Size(70, 21);
            this.WinterSeason.TabIndex = 0;
            this.WinterSeason.TabStop = true;
            this.WinterSeason.Text = "Winter";
            this.WinterSeason.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.WinterSeason.UseVisualStyleBackColor = true;
            this.WinterSeason.CheckedChanged += new System.EventHandler(this.radioButton1_CheckedChanged);
            // 
            // SpringSeason
            // 
            this.SpringSeason.AutoSize = true;
            this.SpringSeason.Location = new System.Drawing.Point(0, 27);
            this.SpringSeason.Name = "SpringSeason";
            this.SpringSeason.Size = new System.Drawing.Size(70, 21);
            this.SpringSeason.TabIndex = 1;
            this.SpringSeason.TabStop = true;
            this.SpringSeason.Text = "Spring";
            this.SpringSeason.UseVisualStyleBackColor = true;
            // 
            // SummerSeason
            // 
            this.SummerSeason.AutoSize = true;
            this.SummerSeason.Location = new System.Drawing.Point(0, 54);
            this.SummerSeason.Name = "SummerSeason";
            this.SummerSeason.Size = new System.Drawing.Size(81, 21);
            this.SummerSeason.TabIndex = 2;
            this.SummerSeason.TabStop = true;
            this.SummerSeason.Text = "Summer";
            this.SummerSeason.UseVisualStyleBackColor = true;
            // 
            // FallSeason
            // 
            this.FallSeason.AutoSize = true;
            this.FallSeason.Location = new System.Drawing.Point(0, 81);
            this.FallSeason.Name = "FallSeason";
            this.FallSeason.Size = new System.Drawing.Size(51, 21);
            this.FallSeason.TabIndex = 3;
            this.FallSeason.TabStop = true;
            this.FallSeason.Text = "Fall";
            this.FallSeason.UseVisualStyleBackColor = true;
            // 
            // YearLabel
            // 
            this.YearLabel.AutoSize = true;
            this.YearLabel.Location = new System.Drawing.Point(12, 79);
            this.YearLabel.Name = "YearLabel";
            this.YearLabel.Size = new System.Drawing.Size(38, 17);
            this.YearLabel.TabIndex = 4;
            this.YearLabel.Text = "Year";
            // 
            // YearValue
            // 
            this.YearValue.Location = new System.Drawing.Point(12, 109);
            this.YearValue.Name = "YearValue";
            this.YearValue.Size = new System.Drawing.Size(100, 22);
            this.YearValue.TabIndex = 5;
            // 
            // button1
            // 
            this.button1.Location = new System.Drawing.Point(186, 216);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(100, 23);
            this.button1.TabIndex = 6;
            this.button1.Text = "Select Date";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.button1_Click);
            // 
            // button2
            // 
            this.button2.Location = new System.Drawing.Point(11, 219);
            this.button2.Name = "button2";
            this.button2.Size = new System.Drawing.Size(75, 23);
            this.button2.TabIndex = 7;
            this.button2.Text = "Cancel";
            this.button2.UseVisualStyleBackColor = true;
            this.button2.Click += new System.EventHandler(this.button2_Click);
            // 
            // VagueDate
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(329, 253);
            this.Controls.Add(this.button2);
            this.Controls.Add(this.button1);
            this.Controls.Add(this.YearValue);
            this.Controls.Add(this.YearLabel);
            this.Controls.Add(this.seasons);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.dateTimePicker1);
            this.Name = "VagueDate";
            this.Text = "VagueDate";
            this.seasons.ResumeLayout(false);
            this.seasons.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.DateTimePicker dateTimePicker1;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.GroupBox seasons;
        private System.Windows.Forms.RadioButton WinterSeason;
        private System.Windows.Forms.RadioButton FallSeason;
        private System.Windows.Forms.RadioButton SummerSeason;
        private System.Windows.Forms.RadioButton SpringSeason;
        private System.Windows.Forms.Label YearLabel;
        private System.Windows.Forms.TextBox YearValue;
        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.Button button2;
    }
}