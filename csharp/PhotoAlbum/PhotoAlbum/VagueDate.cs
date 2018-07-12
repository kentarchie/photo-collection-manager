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
    public partial class VagueDate : Form
    {
        public string ReturnVagueDate { get; set; }

        public VagueDate()
        {
            InitializeComponent();
        }

        private void label1_Click(object sender, EventArgs e)
        {

        }

        private void radioButton1_CheckedChanged(object sender, EventArgs e)
        {

        }

        private void button2_Click(object sender, EventArgs e)
        {
            ReturnVagueDate = "";
            this.Close();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            ReturnVagueDate = YearValue.Text;
            this.DialogResult = DialogResult.OK;
            this.Close();
        }
    }
}
