using System.Net.Http.Json;
using StuffManager.Api.Data;

namespace StuffManager.Api.Tests;

public class StuffControllerTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly TestWebApplicationFactory _factory;
    private readonly HttpClient _client;

    public StuffControllerTests(TestWebApplicationFactory factory)
    {
        _factory = factory;
        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task GetStuff_FirstPage_Returns10Items()
    {
        // Act
        var response = await _client.GetAsync("/stuff?page=1");

        // Assert
        response.EnsureSuccessStatusCode();
        var stuffItems = await response.Content.ReadFromJsonAsync<List<Stuff>>();
        
        Assert.NotNull(stuffItems);
        Assert.Equal(10, stuffItems.Count);
        
        // Verify they are the first 10 items (by Id)
        for (int i = 0; i < 10; i++)
        {
            Assert.Equal(i + 1, stuffItems[i].Id);
            Assert.Equal($"Stuff Item {i + 1}", stuffItems[i].Name);
        }
    }

    [Fact]
    public async Task GetStuff_SecondPage_Returns2Items()
    {
        // Act
        var response = await _client.GetAsync("/stuff?page=2");

        // Assert
        response.EnsureSuccessStatusCode();
        var stuffItems = await response.Content.ReadFromJsonAsync<List<Stuff>>();
        
        Assert.NotNull(stuffItems);
        Assert.Equal(2, stuffItems.Count);
        
        // Verify they are items 11 and 12
        Assert.Equal(11, stuffItems[0].Id);
        Assert.Equal("Stuff Item 11", stuffItems[0].Name);
        Assert.Equal(12, stuffItems[1].Id);
        Assert.Equal("Stuff Item 12", stuffItems[1].Name);
    }

    [Fact]
    public async Task GetStuff_ThirdPage_ReturnsEmpty()
    {
        // Act
        var response = await _client.GetAsync("/stuff?page=3");

        // Assert
        response.EnsureSuccessStatusCode();
        var stuffItems = await response.Content.ReadFromJsonAsync<List<Stuff>>();
        
        Assert.NotNull(stuffItems);
        Assert.Empty(stuffItems);
    }

    [Fact]
    public async Task GetStuff_InvalidPage_ReturnsBadRequest()
    {
        // Act
        var response = await _client.GetAsync("/stuff?page=0");

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.BadRequest, response.StatusCode);
    }
}
