using VCT.API.Models.Machines;
using VCT.API.Models.Enums;
namespace VCT.API.Models.Components
{
    public class Configuration
    {
        public int Id { get; set; }
        public List<Tray> Trays { get; set; } = new List<Tray>();
        
        public int MachineTypeId { get; set; }
        private MachineType Type { get; set; }
        private int? Dots;
        private int? TrayWidth;
        
        
        public Configuration() { }
        public Configuration(MachineType type, int id = -1)
        {
            Id = id;
            Type = type;
        }

        public void AddTray()
        {
            throw new NotImplementedException();
        }

        public void RemoveTray() { throw new NotImplementedException(); }

        public void MoveTray(int Position, Tray Tray)
            { throw new NotImplementedException(); }

        public void SwapTrays(Tray tray1, Tray tray2)
            { throw new NotImplementedException(); }
    }
}