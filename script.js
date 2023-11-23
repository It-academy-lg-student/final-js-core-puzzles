/*
Необхідно реалізувати наступний функціонал як на відео Puzzle, а саме:

Необхідно розбити картинку на 16 рівних частин і посмістити їх в блоки. Розбивати картинку на кусочки можна за допомогою background-position
При кліку на кнопку Start game або при перетягуванні пазла на правий блок(використовуємо sortable) має запуститися зворотній відлік. Сама кнопка має заблокуватися.
Якщо час закінчився і ви не встигли скласти пазл має видати повідомлення в модальному вікні: “It's a pity, but you lost”. Кнопка Check result має заблокуватися
При кліку на кнопку Check result має видати повідомлення в модальному вікні: “You still have time, you sure?” з часом який залишився.
При кліку на кнопку Check провіряється чи добре складений пазл, якщо так видає повідомлення: “Woohoo, well done, you did it!” в іншому варіанті “It's a pity, but you lost”. Кнопка Check result має заблокуватися.
При кліку на кнопку Close закриває модальне вікно.
При кліку на кнопку New game скидує час і заново рандомно розставляє пазли. Кнопка Start game має розблокуватися, а кнопка Check result має бути заблокована.
*/
$(document).ready(function(){


    $(window).scroll(function(){
        paralax();
    })
    
    function paralax(){
        let scrollTop = $(window).scrollTop();
        console.log(scrollTop)
        $('.p1').css('top', `${scrollTop*0.45}px`) //top - рух зверху, bottom знизу 
        $('.box2 h2').css('bottom', `${scrollTop*0.35}px`) 
    }
    
    $('.p1').on('click', function(){
        $(this).css('display', 'none') 
    })
    
    
    
    // logos task
    
    
    
    let rows = 4; columns = 4;
    let pieces = '';
    
    for(let i = 0, top = 0, order = 0; i < rows; i++, top-=100) {   //задаємо цикл для створення кубиків з картинки 4*4, order - порядковий номер
        for (let j = 0, left = 0; j < columns; j++, left-=100, order++){
            pieces += "<div style='background-position:" + left + "px " + top + "px;' class = 'piece' data-order=" + order + "></div>"; //для перевірки порядку
        }
        
    }
    $('#piece-container').html(pieces); //додається у правий чи лівий блок
    //console.log(pieces)
    
    //затримка при загрузці
    setTimeout(function(){
       
       //function random(){
        pieces = $('#piece-container div');
      pieces.each(function(){
        let leftPosition = Math.floor(Math.random()*290)+ 'px'; 
        let topPosition = Math.floor(Math.random()*290)+'px';
        $(this).css({
            position: 'absolute',
            left: leftPosition,
            top: topPosition
            
        })
        $('#piece-container').append($(this)) //поміщаємо у цей контейнер 
        $(this).draggable() //запускає блоки в перетягування 
      }) 
    //}
     
    }, 3000)
    
      
    
    //перетягування блоків
    
    
    
      let intervalID;
      let counter = 60;
      let chose = 0;
    
     function timer (){ //функція запуску таймера
        
              
               
            $('#timer').text('00' + ':' + counter);
            counter--;
           {
            if (counter <= 0) {
                clearInterval(intervalID)
                alert('It\'s a pity, but you lost')
                $('#check').attr('disabled', true)
                $('#timer').text('00'+':'+'00')
            }   
                //console.log(counter)
              if(counter < 10) {
                $('#timer').text('00' + ':' + '0' +counter); 
              }
            }
        //}, 1000);
      } 
      $('#start').on('click', function() { 
        intervalID =   setInterval(timer, 1000);
        $(this).attr('disabled', true)
      })
    
      //додаємо класи до елементів при drop, drag 
    
      $('#puzzle-container').droppable({
        accept: function(){
          return !$(this).hasClass('piecePresent')
        },
        //hoverClass: 'ui-highlight',
        drop: function(event, ui) {
          let dragEl = ui.draggable;
          let dropOn = $(this);
          dropOn.addClass('piecePresent'); //щоб елементи не накладались 
          $(dragEl)
            .addClass('dropPiece')
            .css({top: 0, left: 0, position: 'relative'
          }).appendTo('dropOn');
          //checkPuzzle(); //виклик функції перевірки
        }
         
        
         
        })
       
      $('.piece').draggable({
         //вертаємо з неправильним місцем
         //revert: "invalid", 
        start: function(){
          if($(this).hasClass('dropPiece')){
            $(this).removeClass('dropPiece')
            $(this).parent().removeClass('piecePresent')
            
            
          }
          
        }
        
        
    
      })
    
      
    
      //перевірка   
    
    
       $('#check').on('click', function(){
          
       let ask =  confirm (`Are you sure? You still have ${$('#timer').text()}`);
        if (ask) {
          //checkPuzzle();
        //}
      //})
    
          //function checkPuzzle (){
        if($('#puzzle-container .dropPiece').length != 16) {
          alert('You lose. Try again')
          clearInterval(intervalID) 
          return false; 
          
        }
        for(let k = 0; k < 16; k++) {
          let item = $('#puzzle-container .dropPiece : eq(" + k + ")');
          let order = item.data('order');
          if (k != order) {
            alert('You lose. Try again')
            clearInterval(intervalID)
            return false
          }
          alert('Wooho! Well done, you did it');
          return true;
        //}
      } 
    } 
    
    })
    
       //таймер на переносі
    
       $('.image-box').sortable({
        connectWith: '#piece-container, #puzzle-container',
        containment: '#puzzle-container',
        cursor: 'move',
        scroll: false,
        delay: 100,
        //start: function (event, ui) {
          
          drop: function(){
            // $('#start').trigger('click')
             //console.log(event, ui)
             //chose++
             $('#start').trigger('click');
        }
            
          
        })
          //stop: function (event, ui) {
           // $('.piece').on('click', function(){
            //  if(chose > 1) {
              //  $('#start').attr('disabled', true)
              //}
          //}   
           
        
       
       function trigger(){ //працює на клік
        $('.piece').one('click', function(){
          chose++ 
          $('#start').trigger('click'); 
          $('#start').attr('disabled', true)
        })
         //if (chose >1) {
    
        // }
       }
       trigger()
        
       //нова гра
    
       $('#new').on('click', function(){
       location.reload(); 
       //intervalID = setInterval(timer, 1000)
       })
    
       
      
      
      
      
    
    //))
    
    })
    
    
    
    
    
    
    