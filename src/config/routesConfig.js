const routesConfig = {
  users: {
    jwt: false,
    role: undefined,
    login: {
      jwt: false,
      role: undefined
    },
    getUser: {
      jwt: false,
      role: undefined,
      details: {
        jwt: true,
        role: undefined
      },
    },
    create: {
      account: {
        jwt: false,
        role: undefined,
      },
    },
    profile: {
      jwt: false,
      role: undefined,
      update: {
        jwt: true,
        role: "User",
      }
    },
    getUsersSimpleData: {
      jwt: false,
      role: undefined,
    },
  },
  posts: {
    jwt: false,
    role: undefined,
    post: {
      jwt: false,
      role: undefined
    },
    responses: {
      jwt: false,
      role: undefined
    },
    comments: {
      jwt: false,
      role: undefined
    },
    posts: {
      jwt: false,
      role: undefined
    },
    search: {
      jwt: false,
      role: undefined
    },
    tags: {
      jwt: false,
      role: undefined
    },
    create: {
      jwt: true,
      role: "User",
      post: {
        jwt: true,
        role: "User"
      },
      response: {
        jwt: true,
        role: "User"
      },
      comment: {
        jwt: true,
        role: "User"
      },
    },
    delete: {
      jwt: true,
      role: "User",
      post: {
        jwt: true,
        role: "User"
      },
    },
    update: {
      jwt: true,
      role: "User",
      post: {
        jwt: true,
        role: "User"
      },
      response: {
        jwt: true,
        role: "User"
      },
    },
    rate: {
      jwt: true,
      role: "User",
      post: {
        jwt: true,
        role: "User",
      },
      unPost: {
        jwt: true,
        role: "User",
      }
    }
  },
  admin: {
    jwt: true,
    role: "Admin",
    advert: {
      jwt: true,
      role: "Admin",
      create: {
        jwt: true,
        role: "Admin",
      },
      update: {
        jwt: true,
        role: "Admin",
      },
      simpleAdverts: {
        jwt: false,
        role: undefined,
      }
    }
  }
};

export const checkConfigJWT = (urlString) => {
  const urlParts = urlString.split("/");
  let config = routesConfig;
  for (let i = 1; i < urlParts.length; i++) {
    const part =
      urlParts[i].indexOf("?") === -1
        ? urlParts[i]
        : urlParts[i].slice(0, urlParts[i].indexOf("?"));
    if (config[part]) {
      config = config[part];
    } else {
      return null;
    }
  }

  return { jwt: config.jwt, role: config.role };
};
