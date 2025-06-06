using VCT.API.Models.Enums;

namespace VCT.API.Models.Machines
{
    public class MachineTypeSpecs
    {

        public int Id { get; set; }
        public MachineType  MachineType { get; set; }
        public int WidthTray { get; set; }  //MM
        public int Height { get; set; }     //MM
        public int Dots {  get; set; }  //1 dot is 13 mm
        public string Characteristics { get; set; }

        public MachineTypeSpecs(MachineType machineType, int widthTray, int height, int dots, string characteristics)
        {
            Id = (int) machineType;
            MachineType = machineType;
            WidthTray = widthTray;
            Height = height;
            Dots = dots;
            Characteristics = characteristics;
        }
        
    }
}

/*
    // Example: Get the height of a VisionV8 machine
    int visionV8Height = MachineTypeData.MachineTypeSpecs[MachineType.VisionV8].Height;

    // Example: Get the height of a NUUK machine
    int nuukHeight = MachineTypeData.MachineTypeSpecs[MachineType.NUUK].Height;

    // Example: Get the height of a ComboPlus machine
    int comboPlusHeight = MachineTypeData.MachineTypeSpecs[MachineType.ComboPlus].Height;

*/