using Hobdex.Api.Data;
using Hobdex.Api.DTOs;
using Hobdex.Api.Constants;
using Microsoft.EntityFrameworkCore;

namespace Hobdex.Api.Endpoints;

public static class HobbyEndpoints
{
    public static void MapHobbyEndpoints(this WebApplication app)
    {
        app.MapGet("/hobbies", async (HobdexDbContext db) =>
        {
            var hobbies = await db.Hobbies
                .OrderBy(h => h.DisplayOrder)
                .Select(h => new HobbyDto
                {
                    Id = h.Id,
                    Name = h.Name,
                    ImageUrl = h.ImageUrl,
                    Description = h.Description,
                    IconName = h.IconName,
                    DisplayOrder = h.DisplayOrder,
                    TotalEntries = h.Entries.Count(),
                    CompletedEntries = h.Entries.Count(e => e.EntryStatus.Name == EntryStatusNames.Completed),
                    InProgressEntries = h.Entries.Count(e => e.EntryStatus.Name == EntryStatusNames.InProgress),
                })
                .ToListAsync();

            return Results.Ok(hobbies);
        });

        app.MapGet("/hobbies/{id:int}", async (int id, HobdexDbContext db) =>
        {
            var hobby = await db.Hobbies
                .Where(h => h.Id == id)
                .Select(h => new HobbyDto
                {
                    Id = h.Id,
                    Name = h.Name,
                    ImageUrl = h.ImageUrl,
                    Description = h.Description,
                    IconName = h.IconName,
                    DisplayOrder = h.DisplayOrder,
                    TotalEntries = h.Entries.Count(),
                    CompletedEntries = h.Entries.Count(e => e.EntryStatus.Name == EntryStatusNames.Completed),
                    InProgressEntries = h.Entries.Count(e => e.EntryStatus.Name == EntryStatusNames.InProgress),
                })
                .FirstOrDefaultAsync();

            return hobby is null ? Results.NotFound() : Results.Ok(hobby);
        });

        app.MapPut("/hobbies/{id:int}", async (int id, UpdateHobbyDto dto, HobdexDbContext db) =>
        {
            var hobby = await db.Hobbies.FindAsync(id);
            if (hobby is null) return Results.NotFound();

            hobby.Name = dto.Name;
            hobby.Description = dto.Description;
            hobby.UpdatedOn = DateTime.UtcNow;
            hobby.UpdatedBy = 0;

            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        app.MapPut("/hobbies/reorder", async (ReorderHobbiesDto dto, HobdexDbContext db) =>
        {
            var hobbies = await db.Hobbies.Where(h => dto.Ids.Contains(h.Id)).ToListAsync();
            for (int i = 0; i < dto.Ids.Length; i++)
            {
                var hobby = hobbies.FirstOrDefault(h => h.Id == dto.Ids[i]);
                if (hobby is not null) hobby.DisplayOrder = i + 1;
            }
            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        app.MapDelete("/hobbies/{id:int}", async (int id, HobdexDbContext db) =>
        {
            var hobby = await db.Hobbies.FindAsync(id);
            if (hobby is null) return Results.NotFound();

            hobby.IsDeleted = true;
            hobby.UpdatedOn = DateTime.UtcNow;
            hobby.UpdatedBy = 0;

            await db.SaveChangesAsync();
            return Results.NoContent();
        });
    }
}