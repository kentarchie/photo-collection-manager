using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace PhotoAlbum
{
    class PictureInfo
    {
        public string AlbumName { get; set; }
        public string Description { get; set; }
                        public string Filename { get; set; }
                        public string Caption { get; set; }
                        public string DateTaken {get; set; }
                        public string Notes {get; set; }
                        public string Who {get; set; }
    }

    class AlbumDef
    {
        public string AlbumName { get; set; }
        public string[] Pictures { get; set; }
    }
}
