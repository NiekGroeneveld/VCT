using VCT.API.Models.Machines;
using VCT.API.Models.Enums;
using api.Models.Enums;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore.Infrastructure.Internal;
namespace VCT.API.Models.Components
{
    public class Configuration
    {
        public int Id { get; set; }
        public List<Tray> Trays { get; set; } = new List<Tray>();
        public string? Name { get; set; }
        
        
        //NavigationType
        public int MachineId { get; set; }
        public ConfigurationType ConfigurationType { get; set; }
        
        public Configuration() {}

        public void InitializeFromMachineType(MachineType machineType) => ConfigurationType = machineType.ToConfigurationType();
        public int GetTraysCount() => Trays.Count;
        
        
        private int GetNewTrayPosition()
        {
            if(Trays.Count == 0) return 1;
            
            Trays.Sort();

            int LowerTrayPosition = 0;
            int currentMaxGap = 0;
            int newTrayPos = 0;
            for (int i = 0; i < Trays.Count; i++)
            {
                int UpperTrayPosition = Trays[i].TrayPosition;
                if(UpperTrayPosition - LowerTrayPosition > currentMaxGap)
                {
                    currentMaxGap = UpperTrayPosition - LowerTrayPosition;
                    newTrayPos = (UpperTrayPosition + LowerTrayPosition)/2;
                }
                LowerTrayPosition = UpperTrayPosition;
            }
            return newTrayPos == 0 ? (Trays.Count() > 0 ? Trays.Last().TrayPosition + 1 : 1) : newTrayPos;
        }

        
        private void UpdateTrayPositions()
        {
            if(Trays.Count == 0) return;
            Trays.Sort();
            for(int i = 0; i < Trays.Count; i++)
            {
                Trays[i].TrayPosition = i+1;
            }
        }

        public Tray AddTray(int ConfigurationId)
        {
            int newTrayPos = GetNewTrayPosition();
            int configCharacteristics = ConfigurationType.GetConfigurationCharacteristicsByConfigurationType().WidthTray;
            Tray newTray = new Tray{
                ConfigurationId = ConfigurationId,
                TrayPosition = newTrayPos,
                TrayWidth = configCharacteristics
            };
            Trays.Add(newTray);
            UpdateTrayPositions();
            return newTray;
        }
        






    }
}