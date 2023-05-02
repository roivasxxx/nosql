# 5

- ~~Přidání nového threadu -> přidá thread + přidá post + změní thread_count pro daný course~~
- ~~Přidání nového postu -> přidá post + změní post_count a last_post pro daný thread~~
- ~~Smazaní usera -> kontrola conversations -> pokud found conversation má dva deleted usery -> smaže všechny conversationMessages pro found conversation, smaže usera z notifications array u všech threads~~
- Odeslání nové zprávy -> existing conversation => přidá do conversationMessages/ vytvoří conversation a přidá message do conversationMessages
- Smazání threadu -> smaže všechny posty, notifikace o threadu

- ~~Zobrazit fakulty -> ukázat počet courses, ukázat počet všech threads pod fakultami, zobrazit array courses.shortcut~~

- ~~Zobrazit usera - mail, nick, datum registrace, threads u kterých má notifikace ,~~

- ~~Zobrazit usera + jeho konverzace~~

- ~~Pro konverzace matchnout ConversationMessages~~

- Pro usery zobrazit notifikace

- doable course_shortcuts:{$sortArray:{sortBy:1,input:{$map: { input: "$faculties_courses", as: "t", in: {shortcut:"$$t.shortcut",name:"$$t.name"}}}}},

# added directory for mock data

- courses - add thread_id to each doc
