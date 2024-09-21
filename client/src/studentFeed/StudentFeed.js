


function StudentFeed() {

    return (
    <><div id="window" class="container">
            <div class="row">
                <div id="practiceFeed" class="col-3">
                    <div id="me" class="d-flex align-items-center w-100">
                        <img class="ms-3 rounded-circle" src="student.jpeg" />
                        <b class="ms-2 w-100 text-black-50">Welcome student</b>
                        <span class="badge">
                            <i id="addPractice" class="bi bi-plus-circle-fill"></i>
                    </span>
                    </div>
                    <div class="d-flex align-items-center">
                        <br />
                    </div>
                    <div>
                        <ul class="list-group">
                            <li class="list-group-item practice container active">
                                <div class="row">
                                    <div>
                                        <b class="text-black w-100">Practice #4</b>
                                        <span class="badge date">In progress...</span>
                                        <br />
                                    </div>
                                </div>
                            </li>
                            <li class="list-group-item practice container">
                                    <div>
                                        <div>
                                        <b class="text-black w-100">Practice #3</b>
                                        <span class="badge date text-black">Finished</span>
                                        <br />
                                    </div>
                                </div>
                            </li>
                            <li class="list-group-item practice container">
                                <div class="row">
                                    <div>
                                        <b class="text-black w-100">Practice #2</b>
                                        <span class="badge date text-black">Finished</span>
                                        <br />
                                    </div>
                                </div>
                            </li>
                            <li class="list-group-item practice container">
                                <div class="row">
                                    <div>
                                        <b class="text-black w-100">Practice #1</b>
                                        <span class="badge date text-black">Finished</span>
                                        <br />
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