using VCT.API.Models.Products;

namespace VCT.API.Models.Components
{
    public abstract class Extractor
    {
        public int Id { get; set; }
    }

    public class HighExtractor : Extractor
    {
        public int ClipDistance { get; set; }

        public HighExtractor() { }

        public HighExtractor(int id, int clipDistance) : base()
        {
            ClipDistance = clipDistance;
        }

        // Placeholder for SetClipDistance method. Implement later if needed
        public void SetClipDistance(Product product)
        {
            throw new NotImplementedException();
        }
    }

    public class LowExtractor : Extractor
    {
        public LowExtractor() : base() { }
    }
}
