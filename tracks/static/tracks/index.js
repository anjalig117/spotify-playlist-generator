document.addEventListener('DOMContentLoaded', () => {

   
    document.querySelector('#artist-search').onsubmit = () => {

        forms();
        return false;
    };

    
})

function forms()
{
    var artist = document.querySelector('#artist').value;

    options(artist);

    document.querySelector('#artist').value = '';    
}

function options(artist)
{
    console.log(artist);
    //image for searched artist
    fetch(`/search/${artist}`)
    .then(response => response.json())
    .then(result => {
        console.log(result);
        document.querySelector('#artist-image').innerHTML = '';
        var imgs = document.createElement('IMG');
        imgs.className = 'mb-4'
        imgs.setAttribute("src", result.images.url);
        imgs.className = 'artist-image';
        //imgs.setAttribute("height", '40%');
        //imgs.setAttribute("width", '45%');
        document.querySelector('#artist-image').append(imgs);

        fetch(`/artist/${result.name}/${result.uri}/tracks`)
        .then(response => response.json())
        .then(res => {
            console.log(res);
            console.log(res[1][3]);
            //document.querySelector('#playlist').innerHTML = '';
            var table = document.createElement('table');
            table.className = 'table table-hover mb-3 text-white';
            //table.style.marginBottom = '2.5em';
            table.style.fontSize = '1em';
            //table.style.textDecoration = 'bold';
            table.style.marginTop = '2.5em';
            //var thead = document.createElement('thead');
            var t = document.createElement('tr');
            t.style.fontSize = '0.8em';
            t.style.color = '#F2F2F0';
            var th = document.createElement('th');
            th.innerHTML = '';
            t.appendChild(th);
            var th = document.createElement('th');
            th.innerHTML = 'TITLE';
            t.appendChild(th);
            var th = document.createElement('th');
            th.innerHTML = 'ARTIST';
            t.appendChild(th);
            var th = document.createElement('th');
            th.innerHTML = 'ALBUM';
            t.appendChild(th);
            var th = document.createElement('th');
            th.innerHTML = 'DURATION';
            t.appendChild(th);
            //thead.appendChild(t);
            table.appendChild(t);
            var tbdy = document.createElement('tbody');
            

            for (var i = 0; i < res.length; i++)
            {
                var tr = document.createElement('tr');
                tr.setAttribute('data-id', i+1);
                tr.setAttribute('data-uri', res[i][4]);
                tr.style.color = 'white';
                tr.className = 'trs';
                var tds = document.createElement('td');
                //tds.innerHTML = '';
                tds.style.width = '3%';
                tr.appendChild(tds);
                for (var j = 0; j < res[i].length - 2; j++)
                {
                    var td = document.createElement('td');
                    td.style.fontSize = '1em';
                    td.innerHTML = res[i][j];
                    tr.appendChild(td);
                }
                tbdy.appendChild(tr);
            }
            table.appendChild(tbdy);
            console.log(table);
            document.querySelector('#playlist').appendChild(table);

            document.querySelectorAll('.trs').forEach(b => {
                b.onmouseover = () => {
                    console.log(table);
                    //b.style.color = '#06A108';
                    var x = table.rows[b.dataset.id].cells[0];
                    //var di = document.createElement('div');
                    //di.className = 'play-button-outer';
                    var d = document.createElement('div');
                    d.className = 'play-button';
                    x.appendChild(d);
                }

                b.onmouseout = () => {
                    var x = table.rows[b.dataset.id].cells[0];
                    x.innerHTML = '';
                }

                b.onclick = () => {
                    window.open(b.dataset.uri, '_blank');
                }
            })

            var button = document.createElement('button');
            button.className = 'btn btn-success mb-4';
            button.innerHTML = 'Create Playlist';
            button.id = 'mybtn';
            //button.setAttribute('data-toggle', 'modal');
            //button.setAttribute('data-target', '#exampleModal');
            //button.setAttribute('data-whatever', '@mdo');

            var modal = document.getElementById("myModal");
            var span = document.getElementsByClassName("close")[0];

            button.onclick = () => {
                modal.style.display = "block";

                document.querySelector('#playlist-form').onsubmit = () => {
                    
                    var title = document.querySelector('#name').value;
                    var desc = document.querySelector('#description').value;

                    fetch(`/create/playlist/${title}/${desc}`)
                    .then(response => response.json())
                    .then(ress => {
                            for (var i = 0; i < res.length; i++)
                            {
                                fetch(`/create/playlist/add/track/${ress.user_id}/${ress.playlist_id}/${res[i][5]}`)
                                .then(response => response.json())
                                .then(reso => {
                                    console.log(reso);
                                })
                            }
                            span.click();
    
                    })

                    document.querySelector('#name').value = '';
                    document.querySelector('#description').value = '';
                    
                    return false;
                }

                //span.click();
                //var title = 'Hell';
                //var desc = 'First created playlist';

            }

            span.onclick = function() {
                modal.style.display = "none";
              }
            
              window.onclick = function(event) {
                if (event.target == modal) {
                  modal.style.display = "none";
                }
              }

            document.querySelector('#playlist').appendChild(button);

        })

        document.querySelector('#artist-related').innerHTML = '';
        var div = document.createElement('div');
        div.classList.add("row");
        //images of related artists
        fetch(`/related/${result.uri}`)
        .then(response => response.json())
        .then(related => {
            console.log(related);

            for (var i = 0; i < related.length; i++)
            {
                fetch(`/search/${related[i]}`)
                .then(response => response.json())
                .then(artists => {
                    
                    //document.querySelector('#artist-related').innerHTML = '';
                    console.log(artists);
                    console.log(artists.name);
                    //var div = document.createElement('div');
                    //div.classList.add("row");
                    var col = document.createElement('div');
                    //col.className = "col-md-4";
                    col.className = 'col-md-6 mb-4';
                    col.setAttribute('data-name', artists.name);
                    
                    /* col.onclick = () => {
                        options(col.dataset.name);
                    } */
                    //var checkbox = document.createElement('input');
                    //checkbox.className = 'form-check-input'
                    //checkbox.type = 'checkbox';
                    //checkbox.name = artists.name;
                    //checkbox.value = artists.name;
                    //checkbox.onclick = () => {
                        //if (checkbox.checked == true)
                        //{
                            //console.log(checkbox.name);
                            //options(checkbox.name);
                        //}
                    //}

                    //var label = document.createElement('label');
                    //label.htmlFor = artists.name;
                    var divs = document.createElement('div');
                    divs.className = 'text-center';
                    var imgs = document.createElement('IMG');
                    imgs.setAttribute("src", artists.images.url);
                    //imgs.className = 'artist-related';
                    imgs.setAttribute("height", '70%');
                    imgs.setAttribute("width", '65%');
                    imgs.className = 'rounded-circle mb-2';
                    imgs.setAttribute('data-name', artists.name);
                    imgs.onclick = () => {
                        options(imgs.dataset.name);
                    }
                    divs.appendChild(imgs);
                    var p = document.createElement('p');
                    p.innerHTML = artists.name;
                    p.style.color = 'white';
                    p.style.textDecoration = 'bold';
                    divs.appendChild(p);
                    //col.appendChild(checkbox);
                    col.appendChild(divs);
                    div.appendChild(col);

                    var divs = document.createElement('div');
                    divs.appendChild(div);
                    document.querySelector('#artist-related').appendChild(divs);
                })
            }
        })
    })
}