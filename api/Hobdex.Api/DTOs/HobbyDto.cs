namespace Hobdex.Api.DTOs;

public class HobbyDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string? Description { get; set; }
    public string? IconName { get; set; }
    public double DisplayOrder { get; set; }
    public int TotalEntries { get; set; }
    public int CompletedEntries { get; set; }
    public int InProgressEntries { get; set; }
}

public record UpdateHobbyDto(string Name, string? Description);

public record ReorderHobbiesDto(int[] Ids);