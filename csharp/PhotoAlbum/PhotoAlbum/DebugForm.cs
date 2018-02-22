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
        public DebugForm()
        {
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
    }
}
