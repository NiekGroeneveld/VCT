namespace VCT.API.Models.Machines
{
    public class MachineTypeSpecs
    {

        public int WidthTray { get; set; }  //MM
        public int Height { get; set; }     //MM
            public int Dots {  get; set; }  //1 dot is 13 mm
            public string Characteristics { get; set; }

        public MachineTypeSpecs(int widthTray, int height, int dots)
        {
            WidthTray = widthTray;
            Height = height;
            Dots = dots;
        }
        
    }
}
