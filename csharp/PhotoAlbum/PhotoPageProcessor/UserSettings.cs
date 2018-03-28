using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace PhotoPageProcessor
{
    public partial class UserSettings : Form
    {
        public UserSettings()
        {
            InitializeComponent();
            PicturePrefix.Text   = Properties.Settings.Default.PicturePrefix;
            PagePrefix.Text      = Properties.Settings.Default.PagePrefix;
            BackOfPrefix.Text    = Properties.Settings.Default.BackPrefix;
            OrigFolder.Text      = Properties.Settings.Default.OrigFolder;
            DefaultPictures.Text = Properties.Settings.Default.DefaultPictures;
        }

        private void SaveSettings_Click(object sender, EventArgs e)
        {
            Properties.Settings.Default.PicturePrefix   = PicturePrefix.Text;
            Properties.Settings.Default.PagePrefix      = PagePrefix.Text;
            Properties.Settings.Default.BackPrefix      = BackOfPrefix.Text;
            Properties.Settings.Default.OrigFolder      = OrigFolder.Text;
            Properties.Settings.Default.DefaultPictures = DefaultPictures.Text;
            this.Close();
        }

        private void CancelSettings_Click(object sender, EventArgs e)
        {
            this.Close();
        }
    }
}
