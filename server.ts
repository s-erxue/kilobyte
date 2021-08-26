// Copyright (C) 2021 xuefa
// 
// This file is part of kilobyte.
// 
// kilobyte is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// kilobyte is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with kilobyte.  If not, see <http://www.gnu.org/licenses/>.

import express = require("express");

const app = express();

app.set("view engine", "pug");

app.get("/", (_, res) => {
	res.render("index.pug");
});

app.use(express.static("public"));

app.listen(80);
