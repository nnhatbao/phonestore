using System.ComponentModel.DataAnnotations;

namespace PhoneStore.Categories
{
    public class CreateUpdateCategoryDto
    {
        [Required]
        [StringLength(128)]
        public string Name { get; set; }

        public string Description { get; set; }
    }
}