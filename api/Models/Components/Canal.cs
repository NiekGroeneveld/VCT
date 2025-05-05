using VCT.API.Models.Products;

namespace VCT.API.Models.Components
{
    public class Canal
    {
        public int id { get; set; }
        public int CanalNumber { get; set; }
        
        //Had to do with database
        public int ProductId { get; set; }
        public Product Product { get; set;} 
        
        
        public int ExtractorId { get; set; }	
        public Extractor Extractor { get; set; } 
    
        
        public float CanalWidth { get; set ; }
        public float CanalHeight { get; set; }
        public int Capacity { get;  set;}
        public string Settings { get; set; } = "";

        public Canal() { }
        
        public Canal(int id, int canalNumber, Product product, Extractor extractor, float canalWidth, float canalHeight, int capacity) 
        {
            CanalNumber = canalNumber;
            Product = product;
            Extractor = extractor;
            CanalWidth = canalWidth;
            CanalHeight = canalHeight;
            Capacity = capacity;
        }
    }
}
