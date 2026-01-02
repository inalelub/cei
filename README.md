<h1 style="text-align: center">CEI</h1>
<p style="text-align: center">The project is an online voting system. Allows registered users to be able to cast a vote for a specific political party. It also allows all users to view statistics about the elections </p>

<p style="text-align: center">The goal of this project is to recreate the IEC website & to use the ASP.NET Framework (ASP.NET MVC specifically) with all its features (as well as Bootstrap 5). Using different versions of the ASP.NET framework to achieve the goal of this website.</p>

## Prerequisites

1. Make sure you have installed .NET 10 SDK.
2. Make sure you have installed MS SQL Server 2022 & the SQL Server Management Studio.
3. An IDE for viewing the project. It could be  Rider or Visual Studio.
4. Optionally Docker

## Set Up & Running of the Application

1. Clone the repository to your system
```bash
git clone https://www.github.com/inalelub/cei.git
```
2. Open the project in your preferred IDE.
3. Run each individual project using your IDE & use Docker to run the database

```bash
docker compose up
```

## Potential Pitfalls

It might be that when you run the application there is a problem with the connection to the database. There are two connection strings in the ```appsettings.json``` file & which are ```DefaultConnection``` and ```LocalDbConnection```. For a simple & easier way just change line 9 in ```Program.cs``` file to ```LocalDbConnection``` instead of ```DefaultConnetion```. 
