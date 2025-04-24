using VCT.API.Models.Products;

namespace VCT.API.Models.Components
{
    public class Tray
    {
        public int Id { get; set; }
        private const int MINIMUMHEIGHT = 8; //CM
        public int TrayNumber { get;}
        public int TrayPosition { get; }
        public List<Canal> Canals { get; } = new List<Canal>();
        public List<int> Dividers { get; } = new List<int>();
        private int TrayWidth;
        private int TrayHeigth = MINIMUMHEIGHT;

        
        public Tray() { }
        public Tray(int id, int trayNumber, int trayPosition, int trayWidth)
        {
            Id = id;
            TrayNumber = trayNumber;
            TrayPosition = trayPosition;
            TrayWidth = trayWidth;
        }

        void AddCanal(Product product)
        {
            throw new NotImplementedException();
        }

        void RemoveCanal(Product product)
        {
            throw new NotImplementedException();
        }

        public void ConfigureTray()
        { throw new NotImplementedException(); }

        public void UpdateTrayHeight()
            { throw new NotImplementedException(); }
    
    }
}
