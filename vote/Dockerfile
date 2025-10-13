FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source

COPY *.csproj ./
RUN dotnet restore
COPY . ./
RUN dotnet publish -c release -o /app --no-restore

# final stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app .
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
RUN useradd -u 1000 -m appuser
USER appuser
ENTRYPOINT ["dotnet", "vote.dll"]
