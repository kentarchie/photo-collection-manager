using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace PhotoAlbum
{
    public partial class DebugForm : Form
    {
        private PhotoAlbum mainForm = null;
        public DebugForm()
        {
            InitializeComponent();
        }

        public DebugForm(Form callingForm)
        {
            mainForm = callingForm as PhotoAlbum;
            InitializeComponent();
        }
         
        public string LogText
        {
            set
            {
                debugText.AppendText(Environment.NewLine);
                debugText.AppendText(value);
            }
        }
        private void DebugForm_FormClosing(object sender, FormClosingEventArgs e)
        {
            e.Cancel = true; // this cancels the close event.
            PhotoAlbum.Debug = false;
            mainForm.debugSwitch.Text = mainForm.debugSwitch.Text.Replace("On", "Off");
            mainForm.debugSwitch.BackColor = Color.Lime;
            this.Hide();
        } // debugForm_FormClosing

        private void debugText_TextChanged(object sender, EventArgs e)
        {

        }
    }
}
