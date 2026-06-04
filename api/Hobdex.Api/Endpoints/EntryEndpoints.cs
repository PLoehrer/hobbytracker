using Hobdex.Api.Data;
using Hobdex.Api.DTOs;
using Hobdex.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Hobdex.Api.Endpoints;

public static class EntryEndpoints
{
    public static void MapEntryEndpoints(this WebApplication app)
    {
        app.MapGet("/hobbies/{hobbyId:int}/entries", async (int hobbyId, HobdexDbContext db) =>
        {
            var entries = await db.Entries
                .Where(e => e.HobbyId == hobbyId)
                .Include(e => e.EntryStatus)
                .Include(e => e.EntryType)
                .OrderBy(e => e.DisplayOrder)
                .Select(e => new EntryDto(
                    e.Id, e.HobbyId, e.Title, e.Description,
                    e.EntryStatusId, e.EntryStatus.Name,
                    e.EntryTypeId, e.EntryType != null ? e.EntryType.Name : null,
                    e.StartDate, e.EndDate, e.DisplayOrder))
                .ToListAsync();
            return Results.Ok(entries);
        });

        app.MapPost("/entries", async (CreateEntryDto dto, HobdexDbContext db) =>
        {
            var maxOrder = await db.Entries
                .Where(e => e.HobbyId == dto.HobbyId)
                .Select(e => (double?)e.DisplayOrder)
                .MaxAsync() ?? 0;

            var now = DateTime.UtcNow;
            var entry = new Entry
            {
                HobbyId = dto.HobbyId,
                Title = dto.Title,
                Description = dto.Description,
                EntryStatusId = dto.EntryStatusId,
                EntryTypeId = dto.EntryTypeId,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                DisplayOrder = maxOrder + 1,
                CreatedOn = now,
                UpdatedOn = now,
                CreatedBy = 0, // placeholder until auth
                UpdatedBy = 0
            };
            db.Entries.Add(entry);
            await db.SaveChangesAsync();
            return Results.Created($"/entries/{entry.Id}", entry.Id);
        });

        app.MapPut("/entries/{id:int}", async (int id, UpdateEntryDto dto, HobdexDbContext db) =>
        {
            var entry = await db.Entries.FindAsync(id);
            if (entry is null) return Results.NotFound();

            entry.Title = dto.Title;
            entry.Description = dto.Description;
            entry.EntryStatusId = dto.EntryStatusId;
            entry.EntryTypeId = dto.EntryTypeId;
            entry.StartDate = dto.StartDate;
            entry.EndDate = dto.EndDate;
            entry.UpdatedOn = DateTime.UtcNow;
            entry.UpdatedBy = 0; // placeholder until auth

            await db.SaveChangesAsync();
            return Results.NoContent();
        });
    }
}