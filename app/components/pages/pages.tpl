{%function name="pages" page=1 all=1 base=''%}
    {%if not $page%}{%$page=1%}{%/if%}

    <div class="w-page-inner" data-allpage="{%$all%}">
        {%if $page gt 1%}<a href="{%$base%}{%$page - 1%}" class="page-start">{%$page - 1%}</a>{%/if%}

        {%if $page gt 1%}<a href="{%$base%}1">1</a>{%/if%}

        {%if $page gt 4%}<span>...</span>{%/if%}

        {%if $page gt 3%}<a href="{%$base%}{%$page - 2%}">{%$page - 2%}</a>{%/if%}
        {%if $page gt 2%}<a href="{%$base%}{%$page - 1%}">{%$page - 1%}</a>{%/if%}

        <em class="page-select">{%$page%}</em>

        {%if $page lt $all - 1%}<a href="{%$base%}{%$page + 1%}">{%$page + 1%}</a>{%/if%}
        {%if $page lt $all - 2%}<a href="{%$base%}{%$page + 2%}">{%$page + 2%}</a>{%/if%}

        {%if $page lt $all - 3%}<span>...</span>{%/if%}

        {%if $page lt $all%}<a href="{%$base%}{%$all%}">{%$all%}</a>{%/if%}

        {%if $page lt $all%}<a href="{%$base%}{%$page + 1%}" class="page-end">{%$page + 1%}</a>{%/if%}

        <input name="" type="text" class="page-text">
        <input name="" type="button" class="page-btn">
    </div>

    {%script%}require('pages'){%/script%}

{%/function%}


{%script%}
$('.layout').on('click', '.w-page-inner:not(.nojs) a, .w-page-inner:not(.nojs) .page-btn', function () {
	runga('send','event','search','pages', $(this).html() || $(this).siblings('.page-text').val())
})
{%/script%}