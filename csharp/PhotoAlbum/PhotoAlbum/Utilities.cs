using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace PhotoAlbum
{
    public class Utilities
    {
        public static void logger(string str)
        {
            if (PhotoAlbum.Debug) {
                PhotoAlbum.debugForm.LogText = str;
            }
        } // logger


    }
}
