


function StudentFeed() {

    return (
    <><div id="window" class="container">
            <div class="row">
                <div id="practiceFeed" class="col-3">
                    <div id="me" class="d-flex align-items-center w-100">
                        <img class="ms-3 rounded-circle" src="student.jpeg" />
                        <b class="ms-2 w-100 text-black-50">Welcome student</b>
                    </div>
                    <div class="d-flex align-items-center">
                        <span id="searchBar" class="input-group m-2">
                            <span class="input-group-text"><i class="bi-search"></i></span>
                            <input class="form-control inputText" placeholder="Search or start new practice" />
                        </span>
                        <i id="plus" class="bi-plus"></i>
                    </div>
                    <div>
                        <ul class="list-group">
                            <li class="list-group-item practice container active">
                                <div class="row">
                                    <div class="col-2">
                                        <img class="rounded-circle" src="bot.jpg" />
                                    </div>
                                    <div class="col-10">
                                        <b class="text-black w-100">Practice #4</b>
                                        <span class="badge date">In progress...</span>
                                        <br />
                                        <span class="text-opacity-50 text-black lastMessage">
                                            Click to continue practice
                                        </span>
                                    </div>
                                </div>
                            </li>
                            <li class="list-group-item practice container">
                                <div class="row">
                                    <div class="col-2">
                                        <img class="rounded-circle" src="bot.jpg" />
                                    </div>
                                    <div class="col-10">
                                        <b class="text-black w-100">Practice #3</b>
                                        <span class="badge date text-black">Finished</span>
                                        <br />
                                        <span class="text-opacity-50 text-black lastMessage">
                                            Click to see feedback
                                        </span>
                                    </div>
                                </div>
                            </li>
                            <li class="list-group-item practice container">
                                <div class="row">
                                    <div class="col-2">
                                        <img class="rounded-circle" src="bot.jpg" />
                                    </div>
                                    <div class="col-10">
                                        <b class="text-black w-100">Practice #2</b>
                                        <span class="badge date text-black">Finished</span>
                                        <br />
                                        <span class="text-opacity-50 text-black lastMessage">
                                            Click to see feedback
                                        </span>
                                    </div>
                                </div>
                            </li>
                            <li class="list-group-item practice container">
                                <div class="row">
                                    <div class="col-2">
                                        <img class="rounded-circle" src="bot.jpg" />
                                    </div>
                                    <div class="col-10">
                                        <b class="text-black w-100">Practice #1</b>
                                        <span class="badge date text-black">Finished</span>
                                        <br />
                                        <span class="text-opacity-50 text-black lastMessage">
                                            Click to see feedback
                                        </span>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div id="chatFeed" class="col-9">
                    <div id="me" class="d-flex align-items-center w-100">
                        <img class="ms-3 rounded-circle" src="bot.jpg" />
                        <b class="ms-2 text-black-50">bot</b>
                    </div>
                    <div id="chat" class="w-100">
                        <div dir="ltr">
                            <div class="botMessage">
                                Hi, my name is Sara. I have pain in my eyes.
                            </div>
                        </div>
                        <div dir="rtl">
                            <div class="studentMessage">
                                When did it start?
                            </div>
                        </div>
                        <div dir="ltr">
                            <div class="botMessage">
                                About two weeks ago
                            </div>
                        </div>
                    </div>
                    <div class="d-flex">
                        <span id="messageBar" class="input-group">
                            <input class="form-control inputText" placeholder="Type a message" />
                            <button type="submit" class="btn"><i class="bi bi-send"></i></button>
                        </span>
                    </div>
                </div>
            </div>
        </div><script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe" crossorigin="anonymous"></script></>

    );
}

export default StudentFeed;