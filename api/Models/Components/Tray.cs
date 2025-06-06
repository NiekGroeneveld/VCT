using api.Models.Components;
using api.Models.Enums;
using VCT.API.Models.Products;

namespace VCT.API.Models.Components
{
    public class Tray : IComparable<Tray>
    {
        public int Id { get; set; }
        public int ConfigurationId { get; set; }
        public int TrayNumber { get;set;}
        public int TrayPosition { get; set;}
        public List<Canal> Canals { get; set;} = new List<Canal>();
        public List<int> Dividers { get; set;} = new List<int>();
        public  int TrayWidth;
        
        private const int MINIMUMHEIGHT = 8; //CM  
        public int TrayHeigth = MINIMUMHEIGHT;

        
        public Tray() { }
        private Tray(int configurationId, int trayNumber, int trayPosition, int trayWidth)
        {
            ConfigurationId = configurationId;
            TrayNumber = trayNumber;
            TrayPosition = trayPosition;
            TrayWidth = trayWidth;
        }

        public Tray CreateTrayInConfigurationByType(int id, ConfigurationType configurationType, int trayNumber, int trayPosition)
        {
           ConfigurationCharacteristics configurationCharacteristics = configurationType.GetConfigurationCharacteristicsByConfigurationType();
           return new Tray(id, trayNumber, trayPosition, configurationCharacteristics.WidthTray);
           
        }

        public int CompareTo(Tray other)
        {
            return this.TrayPosition.CompareTo(other.TrayPosition);
        }
    
    }
}
