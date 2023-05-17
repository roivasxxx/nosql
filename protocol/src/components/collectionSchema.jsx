import React from "react";
import ListWrapper from "./listWrapper";

export default function CollectionSchema() {
  const required = "Povinný údaj";
  const strType = "Text - String";
  const dataArray = [
    {
      title: "Kolekce - faculties",
      listElements: [
        {
          listTitle: "name",
          listElements: [required, strType, "Minimální délka 0"]
        },
        {
          listTitle: "shortcut",
          listElements: [required, strType, "Minimální délka 0"]
        }
      ]
    },
    {
      title: "Kolekce - courses",
      listElements: [
        {
          listTitle: "faculty_id",
          listElements: [
            required,
            "ObjectID",
            "ObjectID dokumentu z kolekce faculties"
          ]
        },
        {
          listTitle: "name",
          listElements: [required, strType, "Minimální délka 0"]
        },
        {
          listTitle: "shortcut",
          listElements: [required, strType, "Minimální délka 0"]
        }
      ]
    },
    {
      title: "Kolekce - threads",
      listElements: [
        {
          listTitle: "course_id",
          listElements: [
            required,
            "ObjectID",
            "ObjectID dokumentu z kolekce courses"
          ]
        },
        {
          listTitle: "author",
          listElements: [
            required,
            "ObjectID",
            "ObjectID dokumentu z kolekce users"
          ]
        },
        {
          listTitle: "title",
          listElements: [required, strType, "Minimální délka 0"]
        },
        {
          listTitle: "notifications",
          listElements: [
            "Array ObjectID",
            "Array obsahující ObjectID dokumentů z kolekce users"
          ]
        }
      ]
    },
    {
      title: "Kolekce - posts",
      listElements: [
        {
          listTitle: "thread_id",
          listElements: [
            required,
            "ObjectID",
            "ObjectID dokumentu z kolekce threads"
          ]
        },
        {
          listTitle: "author_id",
          listElements: [
            required,
            "ObjectID",
            "ObjectID dokumentu z kolekce users"
          ]
        },
        {
          listTitle: "text",
          listElements: [required, strType, "Minimální délka 0"]
        },
        {
          listTitle: "created_at",
          listElements: [required, "Datum - Date"]
        },
        {
          listTitle: "updated_at",
          listElements: ["Datum - Date"]
        },
        {
          listTitle: "replying_to",
          listElements: [
            "Array ObjectID",
            "Array obsahující ObjectID dokumentů z kolekce posts"
          ]
        }
      ]
    },
    {
      title: "Kolekce - users",
      listElements: [
        {
          listTitle: "email",
          listElements: [
            required,
            strType,
            "Délka mezi 10-96 znaky",
            'Regex "^.+@.+$" ',
            "Příklad - test@test.cz"
          ]
        },
        {
          listTitle: "nickname",
          listElements: [required, strType, "Minimální délka 1"]
        },
        {
          listTitle: "password",
          listElements: [required, strType, "Minimální délka 8"]
        },
        {
          listTitle: "salt",
          listElements: [required, strType, "Minimální délka 1"]
        },
        {
          listTitle: "created_at",
          listElements: [required, "Datum - Date"]
        },
        {
          listTitle: "last_login",
          listElements: [required, "Datum - Date"]
        },
        {
          listTitle: "available_login_attempts",
          listElements: ["Number - celé číslo", "Hodnoty mezi 0-10"]
        },
        {
          listTitle: "allow_message_notifications",
          listElements: ["Boolean - true/false"]
        }
      ]
    },
    {
      title: "Kolekce - conversations",
      listElements: [
        {
          listTitle: "user1",
          listElements: [
            required,
            "ObjectID",
            "ObjectID dokumentu z kolekce users"
          ]
        },
        {
          listTitle: "user2",
          listElements: [
            required,
            "ObjectID",
            "ObjectID dokumentu z kolekce users"
          ]
        }
      ]
    },
    {
      title: "Kolekce - conversation_messages",
      listElements: [
        {
          listTitle: "conversation_id",
          listElements: [
            required,
            "ObjectID",
            "ObjectID dokumentu z kolekce conversations"
          ]
        },
        {
          listTitle: "author",
          listElements: [
            required,
            "ObjectID",
            "ObjectID dokumentu z kolekce users"
          ]
        },
        {
          listTitle: "message",
          listElements: [required, strType, "Minimální délka 0"]
        },
        {
          listTitle: "date",
          listElements: ["Datum - Date"]
        }
      ]
    },
    {
      title: "Kolekce - notifications",
      listElements: [
        {
          listTitle: "user",
          listElements: [
            required,
            "ObjectID",
            "ObjectID dokumentu z kolekce users"
          ]
        },
        {
          listTitle: "title",
          listElements: [required, strType, "Minimální délka 1"]
        },
        {
          listTitle: "message",
          listElements: [required, strType, "Minimální délka 1"]
        },
        {
          listTitle: "created_at",
          listElements: [required, "Datum - Date"]
        },
        {
          listTitle: "read",
          listElements: [required, "Boolean - true/false"]
        }
      ]
    }
  ];
  return <ListWrapper dataArray={dataArray}></ListWrapper>;
}
