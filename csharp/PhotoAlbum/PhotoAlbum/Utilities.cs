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
                var timeStamp = DateTime.Now.ToString("HHmm:ss:ffff");
                var newMessage = string.Format("{0} : {1}",timeStamp, str);
                PhotoAlbum.debugForm.LogText = newMessage;
            }
        } // logger
    }
}
