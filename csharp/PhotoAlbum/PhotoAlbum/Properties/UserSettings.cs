using System;
using System.IO;
using System.Windows.Forms;

namespace PhotoAlbum.Properties
{
    public partial class UserSettings : Form
    {
        public UserSettings()
        {
            InitializeComponent();
            // get values from settings cache
            PhotoDBPath.Text = Properties.Settings.Default.DBPath;
            DBFileName.Text = Properties.Settings.Default.DBName;
        }

        private void button1_Click(object sender, EventArgs e)
        {
            folderBrowserDialog1.RootFolder = Environment.SpecialFolder.MyComputer;
            folderBrowserDialog1.SelectedPath = @"C:\pictures";
            if (folderBrowserDialog1.ShowDialog() == DialogResult.OK)
            {
                string dbPath = folderBrowserDialog1.SelectedPath;
                Utilities.logger("select db folder path: dbPath=:" + dbPath + ":");
                PhotoDBPath.Text = Path.GetFileName(dbPath);
                Properties.Settings.Default.DBPath = PhotoDBPath.Text;
            }
            Utilities.logger("select db folder path: done");
        }

        private void DBFileName_TextChanged(object sender, EventArgs args)
        {
            Properties.Settings.Default.DBName = DBFileName.Text;
        } // DBFileName_TextChanged

        private void UserSettings_Load(object sender, EventArgs e)
        {

        }
    }
}