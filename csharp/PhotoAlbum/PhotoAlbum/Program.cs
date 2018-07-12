using System;
using System.Windows.Forms;

namespace PhotoAlbum
{
    static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            try
            {
                Application.EnableVisualStyles();
                Application.SetCompatibleTextRenderingDefault(false);
                Application.Run(new PhotoAlbum());
            }
            catch (Exception e)
            {
                MessageBox.Show(string.Format("Main exception = :{0}:", e));
            }
        }
    }
}
