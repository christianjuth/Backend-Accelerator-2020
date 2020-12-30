![Break the Love banner](https://i.ibb.co/3dT6kQw/rumad-banner.png)


---

* 👉 [Getting Started](#-getting-started)
* 📦 [Download and Setup](#-download-and-setup)
* 💻 [Environment Variables](#-environment-variables)
* 📚 [Database Setup](#-database-setup)
* ✅ [Testing](#-testing)



## 👉 Getting started

1. Download and setup repo ([directions](#-download-and-setup))

2. Start the first homework app

    ```bash
    npm run dev src/week1/firstserver.js
    ```

    _This will automatically reload the server when you make changes._

    Alternativly you can start the homework app without auto reloading.

    ```bash
    node src/week1/firstserver.js
    ```


## 📦 Download and Setup

1. Clone repo

2. Install dependencies

    ```bash
    npm install
    ```

3. Add environment variables ([more info below](#-environment-variables))

    ```bash
    cp .env.example .env

    # Open .env and set varabiles
    ```

    Set the correct values for all variables in `.env`.

4. Setup and connect to a MongoDB Atlas Cluster

## 💻 Environment Variables

Setup

```bash
cp .env.example .env

# Open .env and set varabiles
```

The following environment variables are required.
```bash
# .env

MONGO_URI=
```

## 📚 Database Setup

1. Create a MongoDB Atlas Account [(directions)](https://docs.atlas.mongodb.com/tutorial/create-atlas-account).

2. Deploy a Free Tier Cluster [(directions)](https://docs.atlas.mongodb.com/tutorial/deploy-free-tier-cluster).

4. Connect to Your Cluster

    * On the Cluster's page click connect.

        ![MongoDB Cluster](https://i.ibb.co/X5V6gKn/Screen-Shot-2021-01-19-at-12-44-38-PM.png)

    * Click `Connect your application`

        ![Connect your application to Cluster](https://i.ibb.co/5v3D57G/Screen-Shot-2021-01-19-at-12-53-46-PM.png)

    * Click `Copy`

        ![Click copy](https://i.ibb.co/3TWzLjB/Screen-Shot-2021-01-19-at-12-55-44-PM.png)

    * Set `MONGO_URI` environment variable in `.env` file by pasting the url you copied.

    * You will need to change `<password>` to your MongoDB Atlas password. You can set `<dbname>` to whatever.

        It will look something like this:

        ```bash
        # .env

        MONGO_URI=MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/rumad?retryWrites=true&w=majority
        ```

## ✅ Testing

  _This section is primarily for RUMAD mentors._

  * Jest tests

      ```bash
      yarn test
      ```