namespace Application.OAuth.GetPKCE;

public record PkceVm
{
    public string CodeChallenge { get; set; }
    public string State { get; set; }
    public string RedirectUri { get; set; }
}