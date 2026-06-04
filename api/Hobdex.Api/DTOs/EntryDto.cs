namespace Hobdex.Api.DTOs;

public record EntryDto(
    int Id,
    int HobbyId,
    string Title,
    string? Description,
    int EntryStatusId,
    string EntryStatusName,
    int? EntryTypeId,
    string? EntryTypeName,
    DateTime? StartDate,
    DateTime? EndDate,
    double DisplayOrder
);

public record CreateEntryDto(
    int HobbyId,
    string Title,
    string? Description,
    int EntryStatusId,
    int? EntryTypeId,
    DateTime? StartDate,
    DateTime? EndDate
);

public record UpdateEntryDto(
    string Title,
    string? Description,
    int EntryStatusId,
    int? EntryTypeId,
    DateTime? StartDate,
    DateTime? EndDate
);